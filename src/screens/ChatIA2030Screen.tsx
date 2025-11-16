import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image } from 'react-native';
// Caminho do componente MessageBubble
import MessageBubble from '../components/MessageBubble';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

// Configurações e URLs
const PRIMARY_COLOR = '#DAA520'; 
const BACKGROUND_COLOR = '#FDF5E6'; 
const TEXT_COLOR = '#2C2C2C'; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// CHAVE API FIXADA (Use a sua chave válida)
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// CAMINHO DA IMAGEM CORRIGIDO: ../assets/logo-zeniata.png
const LOGO_PATH = require('../assets/logo-zeniata.png'); 

export default function ChatIA2030Screen() {
  
  // 💡 MUDANÇA CRÍTICA: A PRIMEIRA MENSAGEM AGORA DEFINE A PERSONA DA IA
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 0,
        // Esta mensagem inicial atua como o systemInstruction (persona da IA)
        content: "Eu sou um mentor e assistente de IA focado em carreiras do futuro, tecnologias (como IA, Web3, dados) e responsabilidade social (ESG). Minhas respostas são profissionais, encorajadoras e focadas em preparar você para o mercado 2030+.",
        isUser: false,
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const callGeminiAPI = async (userMessage: string) => {
    setLoading(true);
    
    if (!API_KEY || API_KEY.length < 10) {
        setLoading(false);
        Alert.alert("ERRO CRÍTICO", "A chave API está ausente ou incompleta.");
        return; 
    }

    try {
      // 1. Converte o histórico de mensagens
      // INCLUINDO A MENSAGEM 0 (persona) para definir o contexto da IA!
      const contents = messages.map(msg => ({ 
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
      contents.push({ role: "user", parts: [{ text: userMessage }] }); 

      
      // *** JSON FINAL E FUNCIONAL: SEM systemInstruction (evita erro 400), mas com temperature e histórico ***
      const payload = {
          contents: contents,
          generationConfig: {
              temperature: 0.7, // Mantemos a temperatura para criatividade
              // systemInstruction FOI REMOVIDO para evitar o erro 400
          }
      };

      // 2. Chama a API
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (!response.ok) {
          console.error("Erro na resposta da API (código):", data);
          
          if (data.error?.message.includes("API key not valid")) {
               Alert.alert("ERRO CHAVE API", "Sua chave Gemini não é válida. Gere uma nova.");
          } else {
               Alert.alert("Erro na IA", `Falha na API: ${data.error?.message || 'Erro desconhecido.'}`);
          }
          return;
      }
      
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!aiResponseText) {
          Alert.alert("Atenção", "A IA não conseguiu gerar uma resposta de texto.");
          return;
      }
      
      // 4. Adiciona a resposta da IA
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: aiResponseText,
        isUser: false,
      }]);

    } catch (error) {
      console.error("Erro na integração (fetch):", error);
      Alert.alert(
          "Erro de Conexão", 
          "Ocorreu um erro de rede ou de processamento."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === '' || loading) return;

    const newMessage: Message = {
      id: Date.now(),
      content: input.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = input.trim();
    setInput('');

    callGeminiAPI(messageToSend);
  };
  
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={styles.fullScreen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Cabeçalho com Logo */}
      <View style={styles.header}>
        <Image 
          source={LOGO_PATH} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.mainTitle}>Chat IA 2030+</Text>
      </View>

      {/* Área de Mensagens (FlatList) */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageBubble content={item.content} isUser={item.isUser} />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Input de Mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte sobre seu projeto, carreira ou IA..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading || input.trim() === ''}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR, 
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
  messageList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: TEXT_COLOR,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: PRIMARY_COLOR, 
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});