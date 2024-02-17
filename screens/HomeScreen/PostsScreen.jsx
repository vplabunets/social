import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useDispatch } from 'react-redux';
import { authSignOutUser } from '../../redux/auth/authOperations';

import DefaultScreen from '../nestedScreens/DefaultScreen';
import CommentsScreen from '../nestedScreens/CommentsScreen';
import MapScreen from '../nestedScreens/MapScreen';

import { Feather } from '@expo/vector-icons';

const NestedStack = createStackNavigator();

const PostsScreen = () => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <NestedStack.Navigator>
      <NestedStack.Screen
        name='DefaultScreen'
        title='Posts'
        component={DefaultScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10, marginBottom: 10 }}
              activeOpacity={0.7}
              onPress={handleSignOut}
            >
              <Feather name='log-out' size={24} color='#BDBDBD' />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedStack.Screen name='Comments' component={CommentsScreen} />
      <NestedStack.Screen name='Map' component={MapScreen} />
    </NestedStack.Navigator>
  );
};
export default PostsScreen;
