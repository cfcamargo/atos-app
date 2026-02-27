import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { MapPin, Flag, Users, Star } from "lucide-react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PublicStackParamList } from "@/models/routes";

export default function Welcome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList>>();

  return (
    <Box className="flex-1 bg-atosBlue dark:bg-[#0F172A] px-6 py-12 justify-between">
      {/* Top Section */}
      <VStack space="sm" className="mt-8 relative">
        <Box className="absolute right-0 top-0">
          <Star color="#e2e8f0" size={24} fill="#e2e8f0" />
        </Box>
        <Text className="text-white text-4xl font-bold tracking-tight">
          Atos.
        </Text>
        <Text className="text-white text-2xl font-medium tracking-tight">
          Conectando vidas.
        </Text>
      </VStack>

      {/* Middle Map/Graphic Section */}
      <Box className="flex-1 items-center justify-center relative">
        {/* Placeholder for the background map circles/dots */}
        <Box className="w-[300px] h-[300px] rounded-full border border-white/10 items-center justify-center absolute">
          <Box className="w-[200px] h-[200px] rounded-full border border-white/10 absolute" />
        </Box>

        {/* Central Pin */}
        <Box
          className="bg-white/10 p-5 rounded-full items-center justify-center z-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <MapPin color="#F59E0B" size={40} fill="#F59E0B" />
        </Box>

        {/* Floating Icons */}
        <Box className="absolute top-1/3 left-8 bg-white/10 p-3 rounded-full">
          <Flag color="#e2e8f0" size={16} fill="#e2e8f0" />
        </Box>
        <Box className="absolute bottom-1/3 right-8 bg-white/10 p-3 rounded-full">
          <Users color="#e2e8f0" size={16} fill="#e2e8f0" />
        </Box>
      </Box>

      {/* Bottom Section */}
      <VStack space="xl" className="mb-4">
        <VStack space="xs">
          <Text className="text-white text-3xl font-bold">Olá.</Text>
          <Text className="text-white text-lg">Como você se sente hoje?</Text>
        </VStack>

        <VStack space="md" className="mt-4">
          <Button
            size="xl"
            variant="solid"
            className="bg-atosAmber rounded-3xl"
            onPress={() => navigation.navigate("Help")}
          >
            <ButtonText className="text-atosDark font-bold text-lg">
              Preciso de Ajuda
            </ButtonText>
          </Button>

          <Button
            size="xl"
            variant="solid"
            className="bg-atosDark dark:bg-white/10 rounded-3xl"
            onPress={() => navigation.navigate("Login")}
          >
            <ButtonText className="text-white font-bold text-lg">
              Entrar
            </ButtonText>
          </Button>
        </VStack>

        <Text className="text-white/60 text-center text-sm mt-4">
          Sua conversa é 100% anônima e segura.
        </Text>
      </VStack>
    </Box>
  );
}
