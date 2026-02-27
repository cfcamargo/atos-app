import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import Routes from "./routes/routes";

import { useColorScheme } from "react-native";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Routes />
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
