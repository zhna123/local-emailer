import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Emailer } from './src/Emailer';
import { SafeAreaView } from 'react-native-safe-area-context'
import { rgbStrings as bases } from "solarizer";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Emailer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bases.base03,
    justifyContent: 'center',
  },
});
