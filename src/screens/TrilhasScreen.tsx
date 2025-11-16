import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Alert, TouchableOpacity } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Tipagem de dados
interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  progresso: number;
}

// Paleta de cores moderna (Dourado/Amarelo)
const PRIMARY_COLOR = '#DAA520'; // Dourado principal
const SECONDARY_COLOR = '#FFD700'; // Dourado secundário (destaque)
const BACKGROUND_COLOR = '#FDF5E6'; // Amarelo claro
const TEXT_COLOR = '#2C2C2C'; // Quase preto
const GRAY_BUTTON = '#E0E0E0'; // Cinza para botão secundário

// Assumindo o caminho corrigido para a logo (logo-zeniata.png)
const LOGO_PATH = require('../assets/logo-zeniata.png'); 

// Componente de Card da Trilha (para melhor organização)
const TrilhaCard: React.FC<{ item: Trilha, onContinuar: (id: string, titulo: string) => void, onDetalhes: (id: string, titulo: string) => void }> = ({ item, onContinuar, onDetalhes }) => (
  <View style={styles.trilhaCard}>
    <Text style={styles.trilhaTitle}>{item.titulo}</Text>
    <Text style={styles.trilhaDescription}>{item.descricao}</Text>
    
    <View style={styles.progressBarContainer}>
      <Text style={styles.progressText}>Progresso: {item.progresso}%</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${item.progresso}%` }
          ]} 
        />
      </View>
    </View>
    
    <View style={styles.buttonsContainer}>
      
      {/* Botão de DETALHES (Secundário) */}
      <TouchableOpacity 
        style={styles.detailsButton}
        // Chamando a função com o ID e o TÍTULO (para exibição do Alert)
        onPress={() => onDetalhes(item.id, item.titulo)}
      >
        <Text style={styles.detailsButtonText}>Detalhes</Text>
      </TouchableOpacity>

      {/* Botão de CONTINUAR (Principal/Destaque) */}
      <TouchableOpacity 
        style={styles.startButton}
        // Chamando a função com o ID e o TÍTULO (para exibição do Alert)
        onPress={() => onContinuar(item.id, item.titulo)}
      >
        <Text style={styles.startButtonText}>Continuar</Text>
      </TouchableOpacity>
      
    </View>
  </View>
);


export default function TrilhasScreen() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);

  // CORREÇÃO: Recebe o título para exibir no Alert, mas mantém o ID para uso futuro
  const handleContinuar = (trilhaid: string, trilhaTitulo: string) => {
    Alert.alert("Ação", `Você clicou em CONTINUAR na trilha: ${trilhaTitulo}\n(ID: ${trilhaid})`);
    // Futuramente, navigation.navigate('ConteudoTrilha', { trilhaId });
  };
  
  // CORREÇÃO: Recebe o título para exibir no Alert, mas mantém o ID para uso futuro
  const handleDetalhes = (trilhaid: string, trilhaTitulo: string) => {
    Alert.alert("Ação", `Você clicou em DETALHES na trilha: ${trilhaTitulo}\n(ID: ${trilhaid})`);
    // Futuramente, navigation.navigate('DetalhesTrilha', { trilhaId });
  };


  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trilhas"));
        const trilhasList: Trilha[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          titulo: doc.data().titulo,
          descricao: doc.data().descricao,
          progresso: doc.data().progresso || 0,
        }));
        setTrilhas(trilhasList);
      } catch (error) {
        console.error("Erro ao buscar trilhas:", error);
        Alert.alert("Erro", "Não foi possível carregar as trilhas do Firestore.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrilhas();
  }, []);

  const renderTrilha = ({ item }: { item: Trilha }) => (
    <TrilhaCard 
      item={item} 
      onContinuar={handleContinuar} 
      onDetalhes={handleDetalhes} 
    />
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com Logo */}
      <View style={styles.header}>
        <Image 
          source={LOGO_PATH}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.mainTitle}>Minhas Trilhas 2030+</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loading} />
      ) : trilhas.length === 0 ? (
        <Text style={styles.noTrilhasText}>
          Nenhuma trilha encontrada. Verifique o Firestore ou o estado de Login.
        </Text>
      ) : (
        <FlatList
          data={trilhas}
          keyExtractor={(item) => item.id}
          renderItem={renderTrilha}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  listContent: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTrilhasText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: TEXT_COLOR,
  },
  trilhaCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: SECONDARY_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  trilhaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 8,
  },
  trilhaDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  startButton: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  startButtonText: {
    color: TEXT_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: GRAY_BUTTON,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  detailsButtonText: {
    color: TEXT_COLOR,
    fontSize: 15,
    fontWeight: '600',
  },
});