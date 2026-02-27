import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Flame, Eye, EyeOff, Apple, ChevronLeft } from "lucide-react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PublicStackParamList } from "@/models/routes";
import { supabase } from "@/utils/supabase";

const loginSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Se tiver sucesso, o listener de onAuthStateChange do Supabase
      // em routes.tsx cuidará da navegação para as Rotas Privadas ou Onboarding
    } catch (error: any) {
      console.error("Erro no login:", error.message);
      Alert.alert(
        "Erro ao acessar",
        "Não foi possível fazer o login. Verifique seu e-mail e senha.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-atosBlue dark:bg-[#0F172A]">
        <Box className="flex-1 px-6 justify-center">
          {/* Header Actions */}
          <Box className="absolute top-6 left-6 z-10 w-full">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2 w-10"
            >
              <ChevronLeft size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Box>

          {/* Logo e Títulos */}
          <Center className="mb-10 mt-12">
            <Box className="w-20 h-20 rounded-full border border-white/10 items-center justify-center bg-white/5 mb-4">
              <Flame size={40} color="#F59E0B" />
            </Box>
            <Text className="text-white text-3xl font-bold tracking-tight">
              Atos
            </Text>
            <Text className="text-gray-400 text-lg mt-1">Conectando a fé</Text>
          </Center>

          {/* Formulário */}
          <VStack space="xl" className="w-full">
            <Box>
              <Text className="text-gray-300 font-medium mb-2 ml-1">
                E-mail
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="outline"
                    size="md"
                    className={`h-14 rounded-3xl border ${errors.email ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-atosAmber"} bg-transparent px-4`}
                  >
                    <InputField
                      placeholder="exemplo@email.com"
                      placeholderTextColor="#6B7280"
                      className="text-white text-base"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.email.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text className="text-gray-300 font-medium mb-2 ml-1">Senha</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="outline"
                    size="md"
                    className={`h-14 rounded-3xl border ${errors.password ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-atosAmber"} bg-transparent pl-4 pr-2`}
                  >
                    <InputField
                      placeholder="••••••••"
                      placeholderTextColor="#6B7280"
                      className="text-white text-base"
                      type={showPassword ? "text" : "password"}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <InputSlot
                      className="pr-3"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <InputIcon
                        as={showPassword ? Eye : EyeOff}
                        className="text-gray-400"
                      />
                    </InputSlot>
                  </Input>
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.password.message}
                </Text>
              )}

              <TouchableOpacity className="mt-3">
                <Text className="text-gray-400 text-sm text-right underline">
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </Box>

            <Button
              size="xl"
              variant="solid"
              className="bg-atosAmber rounded-full h-14 mt-4"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              style={{
                shadowColor: "#F59E0B",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              {loading ? (
                <ButtonSpinner color="#000000" />
              ) : (
                <ButtonText className="text-atosDark font-bold text-lg">
                  Entrar
                </ButtonText>
              )}
            </Button>
          </VStack>

          {/* Divisor "OU ENTRE COM" */}
          <HStack className="items-center w-full my-8">
            <Box className="flex-1 h-[1px] bg-white/10" />
            <Text className="text-gray-500 text-xs font-bold tracking-widest px-4">
              OU ENTRE COM
            </Text>
            <Box className="flex-1 h-[1px] bg-white/10" />
          </HStack>

          {/* Botões Sociais */}
          <HStack space="lg" className="justify-center mb-10">
            <TouchableOpacity
              className="w-14 h-14 rounded-full border border-white/20 items-center justify-center bg-white/5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              {/* Representação do G do Google usando texto colorido para simular */}
              <Text
                style={{
                  color: "#4285F4",
                  fontWeight: "bold",
                  fontSize: 24,
                  paddingBottom: 2,
                }}
              >
                G
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-14 h-14 rounded-full border border-white/20 items-center justify-center bg-white/5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Apple size={24} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </HStack>

          {/* Rodapé */}
          <Center className="absolute bottom-8 left-0 right-0 py-2">
            <HStack className="items-center">
              <Text className="text-gray-400 text-sm">Não tem uma conta? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateAccount")}
              >
                <Text className="text-atosAmber text-sm font-bold">
                  Criar conta
                </Text>
              </TouchableOpacity>
            </HStack>
          </Center>
        </Box>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
