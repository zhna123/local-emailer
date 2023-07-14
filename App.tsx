import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Emailer } from './src/screens/Emailer';
import { SafeAreaView } from 'react-native-safe-area-context'
import { rgbStrings as bases } from "solarizer";

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from './src/screens/Settings';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer>
        <AppDrawer />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();

// adding this to control the scroll view keyboardShouldPersistTaps prop
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} keyboardShouldPersistTaps='handled'>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName='Emailer'
      screenOptions={{
        drawerType: "front",
        drawerStyle: {
          backgroundColor: bases.base0,
        },
        drawerContentStyle: {
          paddingVertical: 10
        },
        drawerActiveBackgroundColor: bases.base01,
        drawerLabelStyle: {
          fontSize: 17,
          fontWeight: "400",
          color: "white"
        },
        headerStyle: {
          backgroundColor: bases.base01,
        },
        headerTitleStyle: {
          color: "white"
        },
        headerTintColor: "white"
      }}
    >

        <Drawer.Screen name='Emailer' component={Emailer}></Drawer.Screen>
        <Drawer.Screen name='Settings' component={Settings}></Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bases.base03,
    justifyContent: 'center',
  },
});
