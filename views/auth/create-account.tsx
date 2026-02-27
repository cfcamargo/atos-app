import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Eye, EyeOff, ChevronLeft } from "lucide-react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createAccountSchema = z
  .object({
    fullName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Endereço de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A confirmação da senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        if (!authData.session) {
          Alert.alert(
            "Verifique seu e-mail",
            "Criamos sua conta! Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada para poder fazer o login.",
            [{ text: "OK", onPress: () => navigation.navigate("Login") }],
          );
        }
        // Se authData.session existir (confirmação de email desligada no banco),
        // o routes.tsx detectará a sessão automaticamente e mudará a tela.
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error.message);
      Alert.alert(
        "Erro ao criar conta",
        error.message || "Tente novamente mais tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-atosBlue dark:bg-[#0F172A]">
        <Box className="flex-1 px-6">
          {/* Header */}
          <HStack className="items-center mt-6 mb-10 w-full">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2"
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold ml-2">
              Criar Conta
            </Text>
          </HStack>

          {/* Text/Titles Section */}
          <VStack space="xs" className="mb-10">
            <Text className="text-gray-400 text-xs font-bold tracking-widest uppercase">
              ATOS APP
            </Text>
            <Heading className="text-white text-3xl font-bold leading-tight mt-1">
              Junte-se à nossa comunidade cristã
            </Heading>
          </VStack>

          {/* Formulário */}
          <VStack space="xl" className="w-full">
            <Box>
              <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                Nome completo
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="outline"
                    size="md"
                    className={`h-14 rounded-3xl border ${errors.fullName ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-atosAmber"} bg-transparent px-4`}
                  >
                    <InputField
                      placeholder="Digite seu nome"
                      placeholderTextColor="#6B7280"
                      className="text-white text-base"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                  </Input>
                )}
              />
              {errors.fullName && (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.fullName.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
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
              <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                Senha
              </Text>
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
                      placeholder="Crie uma senha segura"
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
            </Box>

            <Box>
              <Text className="text-gray-300 font-medium mb-2 ml-1 text-sm">
                Confirmar Senha
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="outline"
                    size="md"
                    className={`h-14 rounded-3xl border ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-atosAmber"} bg-transparent pl-4 pr-2`}
                  >
                    <InputField
                      placeholder="Confirme sua senha"
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
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.confirmPassword.message}
                </Text>
              )}
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
                  Cadastrar
                </ButtonText>
              )}
            </Button>
          </VStack>

          {/* Footer Secion */}
          <Center className="mt-6 mb-8 w-full px-4">
            <Text className="text-gray-400 text-xs text-center leading-relaxed">
              Ao se cadastrar, você concorda com nossos{" "}
              <Text className="text-white text-xs underline">
                Termos de Uso
              </Text>{" "}
              e{" "}
              <Text className="text-white text-xs underline">
                Política de Privacidade
              </Text>
            </Text>
          </Center>

          {/* Fixed bottom Navigation */}
          <Center className="absolute bottom-8 left-0 right-0 py-2">
            <HStack className="items-center">
              <Text className="text-gray-400 text-sm">Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-atosAmber text-sm font-bold">
                  Entre aqui
                </Text>
              </TouchableOpacity>
            </HStack>
          </Center>
        </Box>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
