import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/views/home';
// Importar ícones do Lucide ou do Gluestack

const Tab = createBottomTabNavigator();

export function PrivateRoutes() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0F172A', borderTopWidth: 0 },
        tabBarActiveTintColor: '#F59E0B',
      }}
    >
      <Tab.Screen name="Home" component={Home} /> 
    </Tab.Navigator>
  );
}