import ProfileType from "@/views/auth/profile-type";
import RegisterProfile from "@/views/register/register-profile";
import RegisterChurch from "@/views/register/register-church";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/models/routes";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ProfileType"
    >
      <Stack.Screen name="ProfileType" component={ProfileType} />
      <Stack.Screen name="RegisterProfile" component={RegisterProfile} />
      <Stack.Screen name="RegisterChurch" component={RegisterChurch} />
    </Stack.Navigator>
  );
};
