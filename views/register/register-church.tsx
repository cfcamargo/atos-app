import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Camera,
  Plus,
  Image as ImageIcon,
} from "lucide-react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/models/routes";
import { supabase } from "@/utils/supabase";
import * as ImagePicker from "expo-image-picker";

const registerChurchSchema = z.object({
  cnpj: z.string().min(14, "CNPJ inválido").optional().or(z.literal("")),
  churchName: z.string().min(3, "Digite o nome da sua igreja"),
  denomination: z
    .string()
    .min(2, "Selecione a denominação")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Endereço muito curto"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
});

type RegisterChurchFormData = z.infer<typeof registerChurchSchema>;

export default function RegisterChurch() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [churchImage, setChurchImage] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterChurchFormData>({
    resolver: zodResolver(registerChurchSchema),
    defaultValues: {
      cnpj: "",
      churchName: "",
      denomination: "",
      address: "",
      whatsapp: "",
    },
  });

  const cnpjValue = watch("cnpj");

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão",
            "Precisamos de acesso à câmera para a foto da igreja.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão",
            "Precisamos de acesso à galeria para a foto da igreja.",
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setChurchImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
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
          if (buttonIndex === 1) pickImage(true);
          else if (buttonIndex === 2) pickImage(false);
        },
      );
    } else {
      Alert.alert(
        "Foto da Igreja",
        "Adicione uma foto oficial da igreja",
        [
          { text: "Câmera", onPress: () => pickImage(true) },
          { text: "Galeria", onPress: () => pickImage(false) },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true },
      );
    }
  };

  const onSubmit = async (data: RegisterChurchFormData) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...data, churchImage };
      console.log("Cadastro de Igreja Concluído:", finalData);

      // TODO: Implementar chamada na API para salvar a igreja e a imagem

      // Marcar na sessão que o perfil foi completado
      await supabase.auth.updateUser({
        data: { profile_completed: true },
      });

      // Atualizar a sessão para forçar a re-renderização das rotas globais
      const {
        data: { session },
      } = await supabase.auth.getSession();

      Alert.alert("Igreja Cadastrada!", "Tudo certo, vamos explorar.", [
        {
          text: "Continuar",
          onPress: async () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "ProfileType" as never }],
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possivel completar o cadastro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#0F172A] dark:bg-[#0F172A]">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Box className="flex-1 px-6 pt-6">
            {/* Header */}
            <HStack className="items-center mb-6 relative justify-center w-full">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute left-0 p-2 -ml-2 z-10"
              >
                <ArrowLeft size={24} color="#FFFFFF" className="opacity-90" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-bold">
                Cadastrar Minha Igreja
              </Text>
            </HStack>

            {/* Banner/Profile Picture Upload */}
            <Center className="mb-8 w-full">
              <TouchableOpacity
                activeOpacity={0.8}
                className="relative w-full h-40 rounded-3xl bg-[#1E293B] items-center justify-center border border-[#334155] overflow-hidden"
                onPress={handleImageSectionPress}
              >
                {churchImage ? (
                  <Image
                    source={{ uri: churchImage }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <VStack space="sm" className="items-center">
                    <Box className="w-14 h-14 bg-white/10 rounded-full items-center justify-center mb-2 border border-white/20">
                      <Camera size={24} color="#9CA3AF" />
                    </Box>
                    <Text className="text-gray-400 font-medium text-sm">
                      Foto de Perfil Oficial
                    </Text>
                  </VStack>
                )}
                {churchImage && (
                  <Box className="absolute bottom-3 right-3 bg-black/60 w-10 h-10 rounded-full items-center justify-center backdrop-blur-md">
                    <Camera size={20} color="#FFFFFF" />
                  </Box>
                )}
              </TouchableOpacity>
            </Center>

            {/* IDENTIFICAÇÃO Section */}
            <VStack space="md" className="mb-8">
              <Text className="text-gray-400 text-xs font-bold tracking-widest uppercase ml-1">
                IDENTIFICAÇÃO
              </Text>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  CNPJ da Instituição
                </Text>
                <Controller
                  control={control}
                  name="cnpj"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className="h-14 rounded-3xl border border-[#334155] bg-[#1E293B] px-4"
                    >
                      <InputField
                        placeholder="00.000.000/0000-00"
                        placeholderTextColor="#4B5563"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="numeric"
                      />
                      {value && value.length > 5 && (
                        <InputSlot className="pr-2">
                          <Box
                            className="w-5 h-5 border-2 border-t-atosAmber border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            style={{ transform: [{ rotate: "45deg" }] }}
                          />
                        </InputSlot>
                      )}
                    </Input>
                  )}
                />
              </Box>

              {/* Success Badge */}
              <Box className="flex-row items-center bg-[#064e3b]/30 border border-[#059669]/30 p-3 rounded-2xl">
                <CheckCircle2 size={16} color="#10B981" />
                <Text className="text-[#10B981] text-xs font-bold ml-2">
                  DADOS ENCONTRADOS NA RECEITA FEDERAL
                </Text>
              </Box>
            </VStack>

            {/* DADOS DA IGREJA Section */}
            <VStack space="md" className="mb-10">
              <Text className="text-gray-400 text-xs font-bold tracking-widest uppercase ml-1">
                DADOS DA IGREJA
              </Text>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  Nome da Igreja
                </Text>
                <Controller
                  control={control}
                  name="churchName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className={`h-14 rounded-3xl border ${
                        errors.churchName
                          ? "border-red-500"
                          : "border-[#334155]"
                      } bg-[#1E293B] px-4`}
                    >
                      <InputField
                        placeholder="Igreja Batista Central"
                        placeholderTextColor="#4B5563"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                  )}
                />
              </Box>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  Denominação
                </Text>
                <Controller
                  control={control}
                  name="denomination"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className="h-14 rounded-3xl border border-[#334155] bg-[#1E293B] pl-4 pr-3"
                    >
                      <InputField
                        placeholder="Batista"
                        placeholderTextColor="#4B5563"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                      <InputSlot className="pr-1">
                        <ChevronDown size={20} color="#9CA3AF" />
                      </InputSlot>
                    </Input>
                  )}
                />
              </Box>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  Endereço Completo
                </Text>
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className={`h-14 rounded-3xl border ${
                        errors.address ? "border-red-500" : "border-[#334155]"
                      } bg-[#1E293B] px-4`}
                    >
                      <InputField
                        placeholder="Rua, Número, Bairro, Cidade - UF"
                        placeholderTextColor="#4B5563"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                  )}
                />
              </Box>

              <Box>
                <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                  WhatsApp de Contato
                </Text>
                <Controller
                  control={control}
                  name="whatsapp"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      variant="outline"
                      size="md"
                      className={`h-14 rounded-3xl border ${
                        errors.whatsapp ? "border-red-500" : "border-[#334155]"
                      } bg-[#1E293B] pl-4 pr-4`}
                    >
                      <InputSlot className="pl-1 pr-3 border-r border-[#334155] mr-3">
                        <MessageCircle size={20} color="#9CA3AF" />
                      </InputSlot>
                      <InputField
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#4B5563"
                        className="text-white text-base"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                      />
                    </Input>
                  )}
                />
              </Box>
            </VStack>

            {/* Submit Button */}
            <Button
              size="xl"
              variant="solid"
              className="bg-[#F59E0B] rounded-full h-14 w-full mt-2"
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
                  <ButtonSpinner color="#111827" />
                ) : (
                  <>
                    <ButtonText className="text-[#111827] font-extrabold text-[16px] mr-2">
                      Confirmar e Ir para o Mapa
                    </ButtonText>
                    <ArrowRight size={20} color="#111827" strokeWidth={2.5} />
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
