import React, { useEffect } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Main from './components/main.js';

export default function App() {
  const [fontsLoaded] = useFonts({
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'bungeespice-regular': require('./assets/fonts/BungeeSpice-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare().then(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
