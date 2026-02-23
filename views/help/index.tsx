import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck, User, Heart, Lock, Send } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicStackParamList } from '@/models/routes';
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase";
import { useState } from "react";

const helpSchema = z.object({
    name: z.string().optional(),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres")
});

type HelpFormData = z.infer<typeof helpSchema>;

export default function Help() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();

    const { control, handleSubmit, formState: { errors } } = useForm<HelpFormData>({
        resolver: zodResolver(helpSchema),
        defaultValues: {
            name: '',
            message: ''
        }
    });

    const onSubmit = async(data: HelpFormData) => {
        setLoading(true);
        try {
          const { data: request, error } = await supabase
            .from('help_requests')
            .insert([
              { 
                nickname: data.name || 'Anônimo', 
                feeling_description: data.message 
              }
            ])
            .select()
            .single();

          if (error) throw error;

          navigation.navigate('Waiting', { requestId: request.id });

        } catch (error) {
          console.error("Erro ao enviar pedido:", error);
        } finally {
          setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FBFBFB]">
            {/* Header / Top Navigation */}
            <HStack className="px-5 py-4 items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#181718" />
                </TouchableOpacity>
                <Heading className="flex-1 text-center mr-8 text-[#181718] text-lg font-bold">
                    Solicitar Apoio
                </Heading>
            </HStack>

            <Box className="flex-1 px-6 pt-6 pb-4">
                {/* Introduction Section */}
                <VStack space="md" className="mb-8">
                    <HStack className="bg-atosAmber/10 self-start px-3 py-1.5 rounded-full items-center space-x-1.5 border border-atosAmber/20">
                        <ShieldCheck size={16} color="#F59E0B" />
                        <Text className="text-atosAmber font-bold text-xs tracking-widest ml-1">
                            ESPAÇO SEGURO
                        </Text>
                    </HStack>
                    
                    <Heading className="text-[#181718] text-3xl font-extrablack mt-2">
                        Estamos aqui para ouvir você
                    </Heading>
                    
                    <Text className="text-gray-500 text-base leading-relaxed mt-2">
                        Este é um espaço livre de julgamentos. Compartilhe o que está sentindo e um de nossos conselheiros orará por você.
                    </Text>
                </VStack>

                {/* Form Section */}
                <VStack space="lg" className="flex-1">
                    {/* Name Input */}
                    <Box className={`bg-white rounded-3xl p-5 border shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-100'}`}>
                        <Text className="text-gray-400 font-bold text-xs tracking-widest mb-3">
                            COMO QUER SER CHAMADO?
                        </Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <HStack className="items-center">
                                    <User size={24} color={errors.name ? "#ef4444" : "#F59E0B"} className="mr-3" />
                                    <Input variant="outline" size="md" className="mr-2flex-1 border-0 bg-transparent p-0 h-auto" isInvalid={!!errors.name}>
                                        <InputField 
                                            placeholder="Ex: Batman (Opcional)" 
                                            className="text-lg text-gray-700 placeholder:text-gray-300 p-0"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    </Input>
                                </HStack>
                            )}
                        />
                        {errors.name && (
                            <Text className="text-red-500 text-xs mt-2 ml-1">{errors.name.message}</Text>
                        )}
                    </Box>

                    {/* Message Input */}
                    <Box className={`bg-white rounded-3xl p-5 border shadow-sm flex-1 mb-2 ${errors.message ? 'border-red-500' : 'border-gray-100'}`}>
                        <Text className="text-gray-400 font-bold text-xs tracking-widest mb-3">
                            COMO ESTA SE SENTINDO? *
                        </Text>
                        <Controller
                            control={control}
                            name="message"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <HStack className="items-start flex flex-1">
                                    <Heart size={24} color={errors.message ? "#ef4444" : "#F59E0B"} className="mr-3 mt-1" fill={errors.message ? "#ef4444" : "#F59E0B"} />
                                    <Textarea size="md" className="flex-1 border-0 ml-2 bg-transparent p-0 h-full w-full" isInvalid={!!errors.message}>
                                        <TextareaInput 
                                            placeholder="Escreva aqui o que está sentindo, o que tem te afligido..." 
                                            className="text-lg  p-0 leading-relaxed min-h-[150px]"
                                            textAlignVertical="top"
                                            multiline={true}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    </Textarea>
                                </HStack>
                            )}
                        />
                        {errors.message && (
                            <Text className="text-red-500 text-xs mt-2 ml-1">{errors.message.message}</Text>
                        )}
                    </Box>
                </VStack>

                {/* Footer Section */}
                <VStack space="md" className="mt-4 pt-2">
                    <HStack className="justify-center items-center opacity-50 mb-1">
                        <Lock size={12} color="#181718" />
                        <Text className="text-xs text-center ml-1 italic text-[#181718]">
                            Sua conversa é 100% privada e segura
                        </Text>
                    </HStack>
                    
                    <Button 
                        size="xl" 
                        variant="solid" 
                        className="bg-atosAmber rounded-3xl h-14"
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        <HStack className="items-center justify-center space-x-2 w-full">
                            {loading ? (
                                <ButtonSpinner color="white" />
                            ) : (
                                <>
                                    <ButtonText className="text-white font-bold text-lg mr-2">
                                        Solicitar Apoio
                                    </ButtonText>
                                    <Send size={20} color="white" />
                                </>
                            )}
                        </HStack>
                    </Button>
                </VStack>
            </Box>
        </SafeAreaView>
    );
}