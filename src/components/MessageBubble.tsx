import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define o tipo de mensagem: 'user' ou 'ai'
interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isUser }) => {
  return (
    <View style={[
      styles.container,
      // Alinha a bolha à direita (usuário) ou à esquerda (IA)
      isUser ? styles.userContainer : styles.aiContainer,
    ]}>
      <View style={[
        styles.bubble,
        // Cor de fundo da bolha
        isUser ? styles.userBubble : styles.aiBubble,
      ]}>
        <Text style={isUser ? styles.userText : styles.aiText}>
          {content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end', // Alinha à direita
  },
  aiContainer: {
    alignSelf: 'flex-start', // Alinha à esquerda
  },
  bubble: {
    padding: 12,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: '#007BFF', // Azul
    borderTopRightRadius: 2, // Borda reta no canto superior direito
  },
  aiBubble: {
    backgroundColor: '#E5E5EA', // Cinza claro
    borderTopLeftRadius: 2, // Borda reta no canto superior esquerdo
  },
  userText: {
    color: 'white',
    fontSize: 15,
  },
  aiText: {
    color: '#333',
    fontSize: 15,
  },
});

export default MessageBubble;