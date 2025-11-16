import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { RootStackParamList } from '../../App'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Tipagem para navegação
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navega para a tela Home (que renderiza o TabNavigator)
      navigation.replace('Home'); 
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert("Erro de Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Usuário registrado e logado!");
      navigation.replace('Home');
    } catch (error: any) {
      console.error("Erro no registro:", error);
      Alert.alert("Erro de Registro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Ajuste para Android
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Espaço para a Logo */}
        <Image 
          source={require('../assets/logo-zeniata.png')} // Verifique o caminho da sua logo!
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.welcomeText}>Bem-vindo ao SkillUpPlus 2030+</Text>
        <Text style={styles.subtitle}>Sua jornada de aprendizado do futuro começa aqui.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#A0A0A0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("Ops!", "Funcionalidade em desenvolvimento.")}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6', // Fundo amarelo claro
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 180, // Ajuste conforme o tamanho da sua logo
    height: 180,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C2C2C', // Quase preto
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#2C2C2C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#DAA520', // Dourado principal
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#FFD700', // Dourado secundário
    shadowColor: '#FFD700',
    shadowOpacity: 0.2,
    elevation: 3,
  },
  registerButtonText: {
    color: '#2C2C2C', // Cor do texto para contraste
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#DAA520', // Dourado
    marginTop: 20,
    fontSize: 14,
  },
});