import Login from "@/views/auth/login";
import CreateAccount from "@/views/auth/create-account";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "@/views/welcome";
import Help from "@/views/help";
import Waiting from "@/views/waiting";

const Stack = createNativeStackNavigator();

export const PublicRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Waiting" component={Waiting} />
    </Stack.Navigator>
  );
};
