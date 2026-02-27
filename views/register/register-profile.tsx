import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  Button,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import {
  Plus,
  MapPin,
  ArrowRight,
  Image as ImageIcon,
  Camera,
  Upload,
} from "lucide-react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActionSheetIOS,
  Platform,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/models/routes";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/utils/supabase";

const registerProfileSchema = z.object({
  nickname: z.string().min(2, "Digite seu nome ou apelido"),
  city: z.string().min(2, "Digite a sua cidade"),
});

type RegisterProfileFormData = z.infer<typeof registerProfileSchema>;

const INTEREST_OPTIONS = [
  "Acolhimento",
  "Grupos de Oração",
  "Voluntariado",
  "Missões",
];

type RegisterProfileRouteProp = RouteProp<
  OnboardingStackParamList,
  "RegisterProfile"
>;

export default function RegisterProfile() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const route = useRoute<RegisterProfileRouteProp>();
  // Safely extract profileType, defaulting to member if not provided
  const profileType = route.params?.profileType || "member";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProfileFormData>({
    resolver: zodResolver(registerProfileSchema),
    defaultValues: {
      nickname: "",
      city: "",
    },
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Precisamos de acesso à câmera para tirar sua foto de perfil.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Precisamos de acesso à galeria para escolher sua foto de perfil.",
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const handleImageSectionPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Tirar Foto", "Escolher da Galeria"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage(true);
          } else if (buttonIndex === 2) {
            pickImage(false);
          }
        },
      );
    } else {
      Alert.alert(
        "Foto de Perfil",
        "Escolha de onde quer adicionar sua foto:",
        [
          { text: "Câmera", onPress: () => pickImage(true) },
          { text: "Galeria", onPress: () => pickImage(false) },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true },
      );
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegisterProfileFormData) => {
    setIsSubmitting(true);
    try {
      const finalData = {
        ...data,
        interests: selectedInterests,
        profileImageUri: profileImage,
        profileType: profileType,
      };
      console.log("Completar Perfil Concluído, salvando no DB:", finalData);

      // TODO: Implementar chamada na API para salvar o perfil do usuário (nickname, city, interests, profile_picture)

      if (profileType === "leader") {
        // Se for líder, avança para a próxima etapa sem remover o @Atos:new_user ainda
        navigation.navigate("RegisterChurch");
      } else {
        // Se for membro, finaliza o onboarding aqui
        await supabase.auth.updateUser({
          data: { profile_completed: true },
        });

        // Atualizar a sessão para forçar a re-renderização das rotas globais
        const {
          data: { session },
        } = await supabase.auth.getSession();

        Alert.alert("Bem-vindo!", "Seu perfil foi criado com sucesso.", [
          {
            text: "Começar a usar",
            onPress: async () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "ProfileType" as never }],
              });
            },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possivel completar seu perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    console.log("Pulou Completar Perfil");
    if (profileType === "leader") {
      navigation.navigate("RegisterChurch");
    } else {
      await supabase.auth.updateUser({
        data: { profile_completed: true },
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "ProfileType" as never }],
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-atosBlue dark:bg-[#0F172A]">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Box className="flex-1 px-6 pt-4 pb-8">
            {/* Profile Picture Upload Section */}
            <Center className="mb-10 w-full mt-10">
              <TouchableOpacity
                activeOpacity={0.8}
                className="relative"
                onPress={handleImageSectionPress}
              >
                <Box className="w-[120px] h-[120px] rounded-full bg-[#E5C3B3] items-center justify-center border-4 border-transparent dark:border-[#0F172A] overflow-hidden">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Box className="w-16 h-16 bg-white/40 items-center justify-center -translate-y-2 border-2 border-white">
                      {/* Placeholder image representation */}
                      <ImageIcon size={28} color="#9CA3AF" />
                    </Box>
                  )}
                </Box>
                {/* Add Button Badge */}
                <Box className="absolute bottom-1 right-1 bg-atosAmber w-8 h-8 rounded-full items-center justify-center border-2 border-atosBlue dark:border-[#0F172A]">
                  <Plus size={16} color="#000000" strokeWidth={3} />
                </Box>
              </TouchableOpacity>
            </Center>

            {/* Titles */}
            <Heading className="text-white text-3xl font-bold mb-8">
              Completar Perfil
            </Heading>

            {/* Form Fields */}
            <VStack space="xl" className="w-full mb-10">
              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  Como todos te chamam?
                </Text>
                <Controller
                  control={control}
                  name="nickname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className={`h-14 rounded-3xl border ${
                        errors.nickname
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-atosAmber"
                      } bg-white/5 dark:bg-transparent px-4`}
                    >
                      <InputField
                        placeholder="Digite seu nome ou apelido"
                        placeholderTextColor="#6B7280"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                  )}
                />
                {errors.nickname && (
                  <Text className="text-red-500 text-xs mt-1 ml-2">
                    {errors.nickname.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  Sua Cidade
                </Text>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className={`h-14 rounded-3xl border ${
                        errors.city
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-atosAmber"
                      } bg-white/5 dark:bg-transparent pl-4 pr-3`}
                    >
                      <InputField
                        placeholder="Onde você mora?"
                        placeholderTextColor="#6B7280"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                      <InputSlot className="pr-1">
                        <MapPin size={20} color="#6B7280" />
                      </InputSlot>
                    </Input>
                  )}
                />
                {errors.city && (
                  <Text className="text-red-500 text-xs mt-1 ml-2">
                    {errors.city.message}
                  </Text>
                )}
              </Box>
            </VStack>

            {/* Interests Section */}
            <VStack space="md" className="w-full mb-12">
              <Text className="text-white text-lg font-bold">
                No que você tem interesse?
              </Text>
              <Box className="flex-row flex-wrap gap-3">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      activeOpacity={0.7}
                      onPress={() => toggleInterest(interest)}
                      className={`px-5 py-3 rounded-full border transition-all ${
                        isSelected
                          ? "border-atosAmber bg-transparent"
                          : "border-white/10 bg-white/5 dark:bg-transparent"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isSelected ? "text-atosAmber" : "text-gray-400"
                        }`}
                      >
                        {interest}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Box>
            </VStack>

            {/* Submit Button */}
            <Button
              size="xl"
              variant="solid"
              className="bg-atosAmber rounded-full h-14 w-full mt-auto mb-4"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={{
                shadowColor: "#F59E0B",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <HStack className="items-center justify-center space-x-2">
                {isSubmitting ? (
                  <ButtonSpinner color="white" />
                ) : (
                  <>
                    <ButtonText className="text-white font-bold text-lg mr-2">
                      Concluir perfil
                    </ButtonText>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </HStack>
            </Button>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
