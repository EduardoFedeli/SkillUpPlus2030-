import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker'; // Importa o ImagePicker

export default function PerfilScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const userEmail = user ? user.email : "Usuário não logado";
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // Para indicar upload, se fosse pra Firebase Storage

  // Carregar imagem de perfil (simulado por enquanto, em um projeto real viria do Firebase Storage)
  useEffect(() => {
    // Aqui você carregaria a URL da imagem do usuário do Firestore/Firebase Storage
    // Por enquanto, é um placeholder ou nulo.
    // Ex: const imageUrl = await getProfileImageUrl(user.uid);
    // setProfileImage(imageUrl);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O app voltará para a tela de Login automaticamente.
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível desconectar. Tente novamente.");
    }
  };

  const pickImage = async () => {
    // Solicitar permissões de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria para escolher uma foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // Em um projeto real, aqui você faria o upload da imagem para o Firebase Storage
      // Ex: uploadImageToFirebase(result.assets[0].uri);
      // setUploading(true);
      // ... lógica de upload ...
      // setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={120} color="#DAA520" />
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}
          <View style={styles.cameraIcon}>
             <Ionicons name="camera" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.title}>Perfil do Usuário</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.infoText}>{userEmail}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Pontuação Atual:</Text>
        <Text style={styles.infoText}>12.500 Pontos</Text> 
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => {
            Alert.alert(
                "Sair da Conta",
                "Tem certeza que deseja fazer logout?",
                [
                    { text: "Cancelar", style: "cancel", onPress: () => {} }, // Adiciona onPress para cancelar
                    { text: "Sair", onPress: handleLogout, style: "destructive" }
                ]
            );
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>SkillUpPlus 2030+ | Versão 1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6', // Fundo amarelo claro
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  imagePicker: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DAA520', // Dourado principal
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFD700', // Borda dourada
    overflow: 'hidden', // Esconde partes da imagem que excedem a borda
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70, // Garante que a imagem seja redonda
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#2C2C2C', // Quase preto para o ícone
    borderRadius: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFD700', // Borda dourada secundária
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 18,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC3545', // Vermelho para logout
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#DC3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionText: {
    marginTop: 'auto', 
    fontSize: 12,
    color: '#666666',
  }
});