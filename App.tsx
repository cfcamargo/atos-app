import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import Routes from './routes/routes';

export default function App() {
  return (
    <GluestackUIProvider mode="dark">
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
