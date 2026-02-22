import Login from "@/views/auth/login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from '@/views/welcome';

const Stack = createNativeStackNavigator();

export const PublicRoutes = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}