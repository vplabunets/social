import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PostsScreen from './HomeScreen/PostsScreen';
import CreatePostsScreen from './HomeScreen/CreatePostsScreen';
import ProfileScreen from './HomeScreen/ProfileScreen';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';

const HomeTab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <HomeTab.Navigator
      initialRouteName='Create Post'
      options={{ headerShown: true }}
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: Colors.whiteTextColor,
        tabBarActiveBackgroundColor: Colors.accentColor,
        tabBarInactiveTintColor: '#212121CC',
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 9,
          paddingHorizontal: 63,
          paddingBottom: 50,
        },
      }}
    >
      <HomeTab.Screen
        name='Default'
        component={PostsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name='grid-outline'
              size={size}
              color={color}
              focused={focused}
            />
          ),
          tabBarItemStyle: {
            marginRight: 15,
            width: 70,
            height: 40,
            borderRadius: 20,
          },
        }}
      />
      <HomeTab.Screen
        name='Create post'
        component={CreatePostsScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name='add' size={size} color={color} focused={focused} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16, marginBottom: 10 }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Default')}
            >
              <Ionicons
                name='arrow-back'
                size={24}
                color={Colors.placeholderTextColor}
              />
            </TouchableOpacity>
          ),

          tabBarItemStyle: {
            marginRight: 15,
            width: 70,
            height: 40,
            borderRadius: 20,
          },
        }}
      />
      <HomeTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name='user' size={size} color={color} focused={focused} />
          ),
          headerShown: false,
          tabBarItemStyle: {
            width: 70,
            height: 40,
            borderRadius: 20,
          },
        }}
      />
    </HomeTab.Navigator>
  );
};

export default HomeScreen;
