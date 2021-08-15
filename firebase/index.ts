import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAq4dGUzqqu_vpo7lfsY0CbDoEpFCPl__s',
  authDomain: 'signal-backend.firebaseapp.com',
  projectId: 'signal-backend',
  storageBucket: 'signal-backend.appspot.com',
  messagingSenderId: '934532142366',
  appId: '1:934532142366:web:53a8a6b561126238c4650f',
  measurementId: 'G-W5K7BFEMCP',
};

let app: firebase.app.App;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = app.firestore();
export const auth = firebase.auth();

export declare interface ChatObjectShape {
  chatText?: string;
  id?: string;
}

export declare interface MessageObjectShape {
  text: string;
  timestamp: firebase.firestore.Timestamp;
  displayName: string;
  email: string;
  photoURL: string;
  id: string;
}

export const getChatsFromDB = async () => {
  try {
    const chats: ChatObjectShape[] = [];
    const chatSnapshot = await firestore.collection('chats').get();
    return chatSnapshot.docs.map((doc) => {
      const chat = { ...(doc.data() as ChatObjectShape) };
      return chat;
    });
  } catch (error) {
    return [];
  }
};
export const addChatToDB = async ({ chatText }: ChatObjectShape) => {
  try {
    const docRef = firestore.collection('chats').doc();
    await docRef.set({ id: docRef.id, chatText });
  } catch (error) {}
};

export const addMessageToChat = async (id: string, text: string) => {
  try {
    const docRef = firestore
      .collection('chats')
      .doc(id)
      .collection('messages')
      .doc();
    await docRef.set({
      id: docRef.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: text,
      displayName: auth?.currentUser?.displayName,
      email: auth?.currentUser?.email,
      photoURL: auth?.currentUser?.photoURL,
    });
  } catch (error) {}
};

export const getMessagesFromDb = async (id: string) => {
  try {
    const messages: MessageObjectShape[] = [];
    const messageSnapshot = await firestore
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();
    return messageSnapshot.docs.map((doc) => {
      const message = { ...(doc.data() as MessageObjectShape) };
      return message;
    });
  } catch (error) {
    return [];
  }
};
