import { initializeApp } from "firebase/app";
// Simplifica a importação para apenas o necessário
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

// Suas credenciais (Confirmadas anteriormente)
const firebaseConfig = {
  apiKey: "AIzaSyCbhSAlbu-RKrOUWT1gB6tmAzj-ATeWJW8",
  authDomain: "skillupplus2030-d37cc.firebaseapp.com",
  projectId: "skillupplus2030-d37cc",
  storageBucket: "skilluppplus2030-d37cc.firebasestorage.app",
  messagingSenderId: "907690436832",
  appId: "1:907690436832:web:1ebcc17c373eb2cdd60885"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta a Autenticação sem persistência
export const auth = getAuth(app);

// Exporta o banco de dados (Firestore)
export const db = getFirestore(app);