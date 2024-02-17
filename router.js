import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';

const AuthStack = createStackNavigator();

export const useRouter = (isLoggined) => {
  if (!isLoggined) {
    return (
      <AuthStack.Navigator initialRouteName='Login'>
        <AuthStack.Group>
          <AuthStack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <AuthStack.Screen
            name='Registration'
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
        </AuthStack.Group>
      </AuthStack.Navigator>
    );
  } else {
    return (
      <AuthStack.Navigator initialRouteName='Login'>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name='Home'
          component={HomeScreen}
        />
      </AuthStack.Navigator>
    );
  }
};
