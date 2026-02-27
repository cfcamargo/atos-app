import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { X, User, CheckCircle2, Circle } from "lucide-react-native";
// Building or Landmark if Church isn't found, but let's try a generic import first.
// We will use User for member and a different icon for leader
import { Church } from "lucide-react-native"; // Assuming Church exists in modern lucide
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  OnboardingStackParamList,
  PublicStackParamList,
} from "@/models/routes";

type ProfileSelection = "member" | "leader";

export default function ProfileType() {
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileSelection>("member");
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleContinue = () => {
    // Proceed to the next step or main app, logging for now
    console.log("Perfil Selecionado:", selectedProfile);
    navigation.navigate("RegisterProfile", { profileType: selectedProfile });
  };

  const handleSkip = () => {
    console.log("Pulou a seleção de perfil");
    // navigation.navigate("SomeOtherScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-atosBlue dark:bg-[#0F172A]">
      <Box className="flex-1 px-6 pt-6 pb-8 justify-between">
        {/* Header */}
        <HStack className="items-center mb-8 relative justify-center w-full">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0 p-2 -ml-2 z-10"
          >
            <X size={24} color="#FFFFFF" className="opacity-80" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            Como você quer começar?
          </Text>
        </HStack>

        {/* Cards Section */}
        <VStack space="xl" className="flex-1 w-full mt-4">
          {/* Card: Sou Membro */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedProfile("member")}
            className={`w-full rounded-[24px] p-6 items-center border-2 border-transparent transition-all duration-200 ${
              selectedProfile === "member"
                ? "bg-[#1E293B]/50 dark:bg-white/5 border-atosAmber"
                : "bg-[#1E293B]/30 dark:bg-white/5 border-white/5"
            }`}
          >
            {/* Icon Wrapper */}
            <Box
              className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
                selectedProfile === "member" ? "bg-atosAmber/20" : "bg-white/10"
              }`}
            >
              <User
                size={28}
                color={selectedProfile === "member" ? "#F59E0B" : "#9CA3AF"}
              />
            </Box>

            {/* Selected Label */}
            <Box className="h-5 justify-center mb-1">
              {selectedProfile === "member" ? (
                <Text className="text-atosAmber text-[10px] font-bold tracking-[0.2em] uppercase">
                  Selecionado
                </Text>
              ) : null}
            </Box>

            {/* Titles */}
            <Text className="text-white text-2xl font-bold mb-2">
              Sou Membro
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-6 px-4">
              Quero encontrar igrejas e apoio
            </Text>

            {/* Radio Indicator */}
            <Box className="mt-2 h-6">
              {selectedProfile === "member" ? (
                <Box className="bg-atosAmber rounded-full w-6 h-6 items-center justify-center">
                  <CheckCircle2
                    color="#0F172A"
                    size={16}
                    fill="#F59E0B"
                    strokeWidth={3}
                  />
                </Box>
              ) : (
                <Circle color="#4B5563" size={24} strokeWidth={1.5} />
              )}
            </Box>
          </TouchableOpacity>

          {/* Card: Sou Líder */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedProfile("leader")}
            className={`w-full rounded-[24px] p-6 items-center border-2 border-transparent transition-all duration-200 ${
              selectedProfile === "leader"
                ? "bg-[#1E293B]/50 dark:bg-white/5 border-atosAmber"
                : "bg-[#1E293B]/30 dark:bg-white/5 border-white/5"
            }`}
          >
            {/* Icon Wrapper */}
            <Box
              className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
                selectedProfile === "leader" ? "bg-atosAmber/20" : "bg-white/10"
              }`}
            >
              <Church
                size={28}
                color={selectedProfile === "leader" ? "#F59E0B" : "#9CA3AF"}
              />
            </Box>

            {/* Selected Label */}
            <Box className="h-5 justify-center mb-1">
              {selectedProfile === "leader" ? (
                <Text className="text-atosAmber text-[10px] font-bold tracking-[0.2em] uppercase">
                  Selecionado
                </Text>
              ) : null}
            </Box>

            {/* Titles */}
            <Text className="text-white text-2xl font-bold mb-2">
              Sou Líder
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-6 px-4">
              Quero cadastrar minha igreja e acolher
            </Text>

            {/* Radio Indicator */}
            <Box className="mt-2 h-6">
              {selectedProfile === "leader" ? (
                <Box className="bg-atosAmber rounded-full w-6 h-6 items-center justify-center">
                  <CheckCircle2
                    color="#0F172A"
                    size={16}
                    fill="#F59E0B"
                    strokeWidth={3}
                  />
                </Box>
              ) : (
                <Circle color="#4B5563" size={24} strokeWidth={1.5} />
              )}
            </Box>
          </TouchableOpacity>
        </VStack>

        {/* Bottom Actions */}
        <VStack space="lg" className="w-full mt-4 items-center">
          <Button
            size="xl"
            variant="solid"
            className="bg-atosAmber rounded-2xl h-14 w-full"
            onPress={handleContinue}
          >
            <ButtonText className="text-atosDark font-bold text-lg">
              Continuar
            </ButtonText>
          </Button>

          <TouchableOpacity onPress={handleSkip} className="py-2">
            <Text className="text-gray-400 text-sm">Pular por enquanto</Text>
          </TouchableOpacity>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
