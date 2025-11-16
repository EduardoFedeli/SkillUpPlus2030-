SkillUpPlus 2030+

🚀 Visão Geral do Projeto

O SkillUpPlus 2030+ é um aplicativo mobile desenvolvido em React Native (Expo) com o objetivo de ser um mentor digital focado nas carreiras e habilidades do futuro.

O projeto se destaca por dois pilares:

Trilhas de Aprendizado Dinâmicas: Conteúdo estruturado (como Engenharia de Dados, ESG e Front-End) gerenciado via Google Firestore, com acompanhamento de progresso.

Assistente de Mentoria por IA: Um chatbot avançado integrado com a Google Gemini API (gemini-2.5-flash), que atua como um mentor 2030+, fornecendo orientação e tirando dúvidas sobre as carreiras emergentes, Web3, ESG, e o futuro do trabalho.

👥 Integrantes da Equipe

Nome Completo

RM

Eduardo Fedeli Souza

RM550132

Gabriel Torres Luiz

RM98600

Otávio Vitoriano Da Silva

RM552012

⚙️ Tecnologias Principais

Frontend: React Native (Expo)

Banco de Dados: Google Firebase / Firestore

Inteligência Artificial: Google Gemini API (via chamadas REST fetch)

Linguagem: TypeScript

🛠️ Como Configurar e Rodar o Projeto

Pré-requisitos

Você precisa ter o Node.js, npm/yarn e o Expo CLI instalados globalmente.

Instalar Expo CLI:

npm install -g expo-cli


1. Clonar o Repositório

git clone [https://github.com/EduardoFedeli/SkillUpPlus2030-.git]
cd SkillUpPlus2030+


2. Instalar Dependências

npm install 
# ou
yarn install


3. Configurar Firebase

Crie um projeto no Firebase Console.

Obtenha as chaves de configuração do seu app web.

Crie o arquivo de configuração de banco de dados em src/config/firebaseConfig.ts e insira suas chaves (o db precisa ser exportado).

4. Configurar a Gemini API Key (CRÍTICO)

Para proteger sua chave de API, o projeto utiliza variáveis de ambiente.

Crie um arquivo na raiz do projeto chamado .env.

Adicione sua chave Gemini, garantindo que o prefixo EXPO_PUBLIC_ esteja presente:

EXPO_PUBLIC_GEMINI_API_KEY="SUA_CHAVE_AQUI"


5. Executar o Aplicativo

Para garantir que o Expo leia as variáveis de ambiente e o projeto funcione perfeitamente (especialmente após alterações no .env), use o comando start --clear:

npx expo start --clear


Em seguida, você pode escanear o QR Code no seu celular com o aplicativo Expo Go ou usar o atalho para rodar no seu emulador Android/iOS.

📄 Documentação Completa

Para detalhes sobre a arquitetura do projeto, justificativas de design, e prints de todas as telas (requisitos obrigatórios do projeto), consulte o documento de entrega final: