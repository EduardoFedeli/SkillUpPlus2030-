import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importa as Telas
import TrilhasScreen from '../screens/TrilhasScreen';
import ChatIA2030Screen from '../screens/ChatIA2030Screen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

// Paleta de cores moderna (Dourado/Amarelo)
const PRIMARY_COLOR = '#DAA520';
const SECONDARY_COLOR = '#FFD700';

// Define a tipagem das abas
export type TabParamList = {
  Trilhas: undefined;
  ChatIA: undefined;
  Perfil: undefined;
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Trilhas"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: '#FFFFFF',
          borderTopColor: SECONDARY_COLOR,
          borderTopWidth: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

          if (route.name === 'Trilhas') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'ChatIA') {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Trilhas"
        component={TrilhasScreen}
        options={{
          title: 'Trilhas',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="ChatIA"
        component={ChatIA2030Screen}
        options={{
          title: 'IA 2030+',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Perfil',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
