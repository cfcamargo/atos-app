import React, { useEffect, useRef, useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { ChevronLeft, Heart, Quote } from "lucide-react-native";
import { TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PublicStackParamList } from "@/models/routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "@/utils/supabase";
import { Button, ButtonText } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WaitingScreenRouteProp = RouteProp<PublicStackParamList, "Waiting">;

export default function Waiting() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList>>();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Heart Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Indeterminate Progress Bar Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const progressBarTotalWidth = screenWidth - 96; // 48px padding on each side (px-6 is usually 24px)
  const progressBarInnerWidth = progressBarTotalWidth * 0.4; // 40% width for the moving part

  const [loading, setLoading] = useState(false);

  const moveProgress = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, progressBarTotalWidth - progressBarInnerWidth],
  });

  const handleCancel = async () => {
    const requestId = await AsyncStorage.getItem("@Atos:pending_help_id");

    if (!requestId) {
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from("help_requests")
        .update({ status: "cancelled" })
        .eq("id", requestId);

      await AsyncStorage.removeItem("@Atos:pending_help_id");
      navigation.navigate("Welcome");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-atosDark">
      {/* Header */}
      <Box className="px-5 py-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          className="p-2 -ml-2 self-start"
        >
          <ChevronLeft size={24} color="#FBFBFB" />
        </TouchableOpacity>
      </Box>

      <Box className="flex-1 px-6 pt-12 pb-8 justify-between">
        {/* Central Animation Area */}
        <VStack className="items-center justify-center space-y-12">
          {/* Animated Heart */}
          <Box className="relative items-center justify-center w-64 h-64">
            {/* Outer faint ring */}
            <Box className="absolute w-64 h-64 rounded-full border border-atosAmber/20" />

            {/* Inner bright ring */}
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                position: "absolute",
              }}
            >
              <Box className="w-48 h-48 rounded-full border border-atosAmber/50" />
            </Animated.View>

            {/* Solid Background Circle */}
            <Box className="w-40 h-40 rounded-full bg-atosBlue items-center justify-center z-10">
              <Heart size={48} color="#F59E0B" fill="#F59E0B" />
            </Box>
          </Box>

          {/* Texts */}
          <VStack space="md" className="items-center mt-8">
            <Text className="text-white text-3xl font-bold text-center">
              Prepare o seu coração
            </Text>
            <Text className="text-gray-400 text-base text-center leading-relaxed">
              Estamos buscando alguém disponível para caminhar com você neste
              momento. Por favor, aguarde com paciência.
            </Text>

            <Button
              variant="link"
              className="mt-4"
              onPress={handleCancel}
              disabled={loading}
            >
              <ButtonText className="text-atosAmber font-semibold">
                {loading ? "Cancelando..." : "Cancelar"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>

        {/* Bottom Card - Progress and Quote */}
        <Box className="bg-atosBlue rounded-3xl p-6 border border-white/5 mb-4">
          {/* Animated Progress Bar */}
          <Box className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
            <Animated.View
              style={{
                width: progressBarInnerWidth,
                height: "100%",
                backgroundColor: "#F59E0B",
                borderRadius: 9999,
                transform: [{ translateX: moveProgress }],
              }}
            />
          </Box>

          {/* Quote */}
          <HStack className="items-start">
            <Quote size={20} color="#F59E0B" className="mr-3 mt-1" />
            <VStack className="flex-1">
              <Text className="text-white/90 text-sm italic leading-relaxed mb-3 font-medium">
                "O Senhor está perto dos que têm o coração quebrantado"
              </Text>
              <Text className="text-atosAmber font-bold text-xs tracking-widest uppercase">
                Salmos 34:18
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
