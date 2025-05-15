import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from '../screens/LoginScreens';
import RegisterScreen from '../screens/RegisterScreens';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
</Stack.Navigator>

  );
}
