import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Post from '../../components/Post';
import { Colors } from '../../constants/colors';
import { useSelector } from 'react-redux';
import {
  selectEmail,
  selectName,
  selectUserPhoto,
} from '../../redux/auth/authSelectors';
import { db } from '../../firebase/config';
import {
  collection,
  doc,
  setDoc,
  query,
  onSnapshot,
  getDocs,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

const DefaultScreen = ({ route, navigation }) => {
  const userEmail = useSelector(selectEmail);
  const userName = useSelector(selectName);
  const userPhoto = useSelector(selectUserPhoto);
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts = [];
      querySnapshot.forEach((doc) => {
        allPosts.push({ ...doc.data(), id: doc.id });
      });
      setPosts(allPosts);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  useEffect(() => {
    if (route.params) {
      setPosts((prevPosts) => [...prevPosts, route.params]);
    }
  }, [route.params]);

  const addLike = async (id) => {
    const docRef = doc(db, 'posts', id);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image style={styles.userImage} source={{ uri: userPhoto }} />
        <View style={styles.userNameEmailContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <Post
              id={item.id}
              navigation={navigation}
              uri={item.photoUri}
              title={item.title}
              location={item.location}
              locality={item.locality}
              likes={item.likes}
              addLike={addLike}
            />
          );
        }}
      />
    </View>
  );
};

export default DefaultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    marginHorizontal: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 32,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.placeholderTextColor,
  },
  userNameEmailContainer: {},
  userName: {
    color: Colors.mainTextColor,
    fontSize: 13,
    // fontWeight: 700,
  },
  userEmail: {
    color: '#212121CC',
    fontSize: 11,
  },
});
