import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Sidebar({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Menu</Text>
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Déconnexion" onPress={() => navigation.replace('Login')} />
    </View>
  );
}
