import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // Adicionado para Loading

// Importa a navegação por Abas (Tab Navigator)
import TabNavigator from './src/navigation/TabNavigator';
// Importa as telas - ASSUME-SE QUE ESTÃO EM src/screens/
import LoginScreen from './src/screens/LoginScreen'; 
import { auth } from './src/config/firebaseConfig';

// 1. Tipagem para TypeScript (Stack Navigator Principal)
export type RootStackParamList = {
  Login: undefined; 
  Home: undefined; // Home agora renderiza o TabNavigator
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/*
 * O App.tsx agora verifica o estado de autenticação (Login/Logout)
 * e carrega o Stack Navigator (Login -> Home)
 */
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Observador de Autenticação do Firebase
  useEffect(() => {
    // Definimos um pequeno delay para a UI não piscar em carregamentos muito rápidos
    const timer = setTimeout(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        // Limpeza do observador quando o componente for desmontado
        return () => unsubscribe(); 
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Splash/Loading Screen durante a verificação inicial do Firebase
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DAA520" /> 
        </View>
    ); 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        // A rota inicial é determinada pelo estado do usuário!
        initialRouteName={user ? "Home" : "Login"} 
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            headerShown: false, // OBRIGATÓRIO: O Login usa cabeçalho customizado ou nenhum
          }} 
        />
        <Stack.Screen 
          name="Home" 
          component={TabNavigator} // Home agora aponta para o TabNavigator
          options={{ 
            headerShown: false, // OBRIGATÓRIO: Desativa o cabeçalho do Stack para mostrar só o Tab
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDF5E6', // Fundo amarelo claro
    }
});