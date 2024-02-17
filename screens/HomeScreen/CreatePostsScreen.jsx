import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

import { useSelector } from 'react-redux';

import { Colors } from '../../constants/colors';
import IconButton from '../../UI/IconButton';

const CreatePostsScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [title, setTitle] = useState('');
  const [locality, setLocality] = useState('');
  const [location, setLocation] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [photo, setPhoto] = useState('');
  const { userId, name } = useSelector((state) => state.auth);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  function keyboardHide() {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  async function takePhoto() {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setPhoto(uri);
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }

  async function sendPost() {
    const photo = await uploadPhotoToServer();
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    navigation.navigate('DefaultScreen');
    await upLoadPostToServer(title, locality, location, photo, name, userId);
    deletePost();
  }

  async function upLoadPostToServer(
    title,
    locality,
    location,
    photoLink,
    name,
    userId
  ) {
    const postsCollection = collection(db, 'posts');
    const post = await addDoc(postsCollection, {
      title,
      locality,
      location: location.coords,
      photoUri: photoLink,
      name: name,
      userId: userId,
      likes: 0,
    });
    return post;
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function uploadPhotoToServer() {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();
    const storage = getStorage();
    const storageRef = ref(storage, `postImage/${uniquePostId}`);
    await uploadBytes(storageRef, file).then((snapshot) => {
      return snapshot;
    });

    const processedPhoto = await getDownloadURL(storageRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error);
      });
    return processedPhoto;
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function deletePost() {
    setTitle('');
    setLocality('');
    setLocation('');
    setPhoto('');
  }
  return (
    <TouchableWithoutFeedback style={{ width: '100%' }} onPress={keyboardHide}>
      <KeyboardAvoidingView
        style={{ width: '100%', height: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          style={{
            ...styles.form,
            marginTop: isShowKeyboard ? -150 : 0,
          }}
        >
          <View style={styles.imageContainer}>
            {photo && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: photo }}
                  style={{ width: 150, height: 100 }}
                />
              </View>
            )}
            <Camera style={styles.imageContainer} type={type} ref={cameraRef}>
              <View style={styles.takeImageContainer} onPress={takePhoto}>
                <IconButton
                  icon='camera'
                  size={24}
                  color={Colors.placeholderTextColor}
                  onPress={takePhoto}
                />
              </View>
              <TouchableOpacity
                style={styles.toggleCameraButton}
                onPress={toggleCameraType}
              >
                <Text style={styles.toggleCameraButtonText}>Flip Camera</Text>
              </TouchableOpacity>
            </Camera>
          </View>
          <TouchableOpacity
            style={styles.manageImage}
            onPress={() => pickImage()}
          >
            <Text>upload or edit image</Text>
          </TouchableOpacity>
          <TextInput
            inputMode='text'
            style={{ marginBottom: 20, ...styles.input }}
            placeholder='Post title...'
            onFocus={() => {
              setIsShowKeyboard(true);
            }}
            value={title}
            onChangeText={(value) => setTitle(value)}
          />
          <View style={styles.inputLocationContainer}>
            <IconButton
              icon='location-outline'
              size={24}
              color={Colors.placeholderTextColor}
            />
            <TextInput
              inputMode='text'
              style={styles.input}
              placeholder='Locality'
              onFocus={() => {
                setIsShowKeyboard(true);
              }}
              value={locality}
              onChangeText={(value) => setLocality(value)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.publishButton}
            onPress={sendPost}
          >
            <Text style={styles.buttonText}>Publish</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePost()}
            >
              <IconButton
                icon='trash-outline'
                size={24}
                color={Colors.placeholderTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: Colors.background,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 240,
    marginBottom: 8,
  },
  imagePreviewContainer: {
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 1,
    borderColor: Colors.whiteTextColor,
    width: 150,
    height: 100,
  },
  camera: {
    borderRadius: 10,
    backgroundColor: Colors.inputBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  toggleCameraButton: {
    flex: 1,
    width: 100,
    height: 100,
    color: Colors.whiteTextColor,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  toggleCameraButtonText: {
    color: Colors.whiteTextColor,
  },
  takeImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 90,
    backgroundColor: '#FFFFFF4D',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  manageImage: {
    marginBottom: 32,
    fontSize: 16,
    color: Colors.placeholderTextColor,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.inputBorderColor,
  },
  inputLocationContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  showButtonText: {
    fontSize: 16,
    color: Colors.blueTextColor,
  },
  publishButton: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
  },
  buttonText: {
    color: Colors.whiteTextColor,
    textAlign: 'center',
    fontSize: 16,
  },
  toRegistrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toRegistrationContainerText: {
    color: Colors.blueTextColor,
    color: Colors.blueTextColor,
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteButton: {
    alignSelf: 'center',
    alignContent: 'flex-end',
    width: 70,
    height: 40,
    paddingHorizontal: 23,
    paddingVertical: 8,
    backgroundColor: Colors.inputBorderColor,
    borderRadius: 20,
  },
});
