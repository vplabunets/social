import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { auth, db } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { collection, onSnapshot, query } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectName,
  selectUserId,
  selectUserPhoto,
} from '../../redux/auth/authSelectors';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { authSlice } from '../../redux/auth/authReducer';

import Layout from '../../UI/Layout';
import IconButton from '../../UI/IconButton';
import Post from '../../components/Post';
import { Colors } from '../../constants/colors';

import { AntDesign } from '@expo/vector-icons';

function ProfileScreen({ navigation }) {
  const [userPosts, setUserPosts] = useState([]);
  const dispatch = useDispatch();

  const [userPhoto, setUserPhoto] = useState('');

  const userId = useSelector(selectUserId);
  const name = useSelector(selectName);
  const userPhotoS = useSelector(selectUserPhoto);

  useEffect(() => {
    setUserPhoto(userPhotoS);
  }, [userPhotoS]);

  useEffect(() => {
    getUserPosts();
  }, []);

  const addUserPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newUserPhoto = result.assets[0].uri;
      const { uid, displayName, email } = await auth.currentUser;

      let processedNewPhoto = '';
      if (newUserPhoto) {
        await auth.currentUser;
        const response = await fetch(newUserPhoto);
        const file = await response.blob();
        const uniquePostId = Date.now().toString();
        const storage = getStorage();
        const storageRef = ref(storage, `userImage/${uniquePostId}`);
        await uploadBytes(storageRef, file).then((snapshot) => {
          return snapshot;
        });

        processedNewPhoto = await getDownloadURL(storageRef)
          .then((url) => {
            return url;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: processedNewPhoto,
      });

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          name: displayName,
          email: email,
          userPhoto: processedNewPhoto,
        })
      );
    }
  };

  const deleteUserPhoto = () => {
    setUserPhoto('');
  };

  const getUserPosts = async () => {
    const q = query(collection(db, 'posts'));
    await onSnapshot(q, (querySnapshot) => {
      const userPosts = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userId) {
          userPosts.push({ ...doc.data(), id: doc.id });
        }
      });
      setUserPosts(userPosts);
    });
  };

  const handleSignOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <Layout>
      <View
        style={{
          ...styles.profile,
        }}
      >
        {!userPhoto ? (
          <View>
            <View style={styles.addPhotoBtn}>
              <TouchableOpacity
                // style={styles.addPhotoBtn}
                onPress={addUserPhoto}
              >
                <AntDesign
                  name='pluscircleo'
                  size={25}
                  color={Colors.accentColor}
                  backgroundColor={Colors.background}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}></View>
          </View>
        ) : (
          <View>
            <View style={styles.addPhotoBtn}>
              <TouchableOpacity
                style={{
                  width: '100%',
                }}
                onPress={deleteUserPhoto}
              >
                <AntDesign
                  name='closecircleo'
                  size={25}
                  color={Colors.inputBorderColor}
                  backgroundColor={Colors.background}
                  style={{
                    backgroundColor: 'transparent',
                    width: 26,
                    height: 26,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image style={styles.userImage} source={{ uri: userPhoto }} />
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.logoutContainer}>
          <IconButton
            icon='log-out-outline'
            color={Colors.placeholderTextColor}
            size={24}
            onPress={handleSignOut}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>{name}</Text>
        <FlatList
          style={styles.list}
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Post
                uri={item.photoUri}
                title={item.title}
                location={item.location}
                posts={item.posts}
                likes={item.likes}
                locality={item.locality}
                navigation={navigation}
                id={item.userId}
              />
            );
          }}
        />
      </View>
    </Layout>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: -60,
    left: 128,
    width: 120,
    height: 120,
    backgroundColor: Colors.backgroundGrey,
    borderRadius: 16,
  },
  userImage: {
    flex: 1,
    borderRadius: 16,
  },
  addPhotoBtn: {
    position: 'absolute',
    zIndex: 100,
    left: 220,
    top: 32,
    width: 26,
    height: 26,
    borderRadius: 50,
  },
  profile: {
    flex: 1,
    marginTop: 138,
    paddingBottom: 10,
    backgroundColor: Colors.background,
    width: '100%',
    height: '100%',
    borderTopStartRadius: 25,
    borderTopRightRadius: 25,
  },
  logoutContainer: {
    position: 'absolute',
    top: 22,
    right: 16,
    width: 24,
    height: 24,
  },

  userName: {
    fontFamily: 'roboto-bold',
    textAlign: 'center',
    color: Colors.mainTextColor,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 92,
    marginBottom: 33,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
