import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC3B5RpzIbnEdf9xGoL_PPeGzn-8Qy0ZWI',
  authDomain: 'vpl-social-7722b.firebaseapp.com',
  projectId: 'vpl-social-7722b',
  storageBucket: 'vpl-social-7722b.appspot.com',
  messagingSenderId: '742151574934',
  appId: '1:742151574934:web:682646e4241a74ba4339b7',
  measurementId: 'G-L16NBJFHFZ',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
