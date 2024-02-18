import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';

import { authSignUpUser } from '../../redux/auth/authOperations';
import { useDispatch } from 'react-redux';

import { Colors } from '../../constants/colors';
import Layout from '../../UI/Layout';

const initialState = { name: '', email: '', password: '', userPhoto: null };

function RegistrationScreen({ navigation }) {
  const [isShown, setIsShown] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [user, setUser] = useState(initialState);

  const dispatch = useDispatch();
  const addUserPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const photo = result.assets[0].uri;

      setUser((prevState) => ({
        ...prevState,
        userPhoto: photo,
      }));
    }
  };

  const deleteUserPhoto = () => {
    setUser((prevState) => ({
      ...prevState,
      userPhoto: '',
    }));
  };

  function handleIsShown() {
    setIsShown(!isShown);
  }

  function keyboardHide() {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  }

  function handleSubmitForm() {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    dispatch(authSignUpUser(user));
    setUser(initialState);
  }

  return (
    <Layout>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={keyboardHide}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: '100%', height: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                ...styles.form,
                marginTop: isShowKeyboard ? 100 : 263,
              }}
            >
              {!user.userPhoto ? (
                <View>
                  <View style={styles.addPhotoBtn}>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={addUserPhoto}
                    >
                      <AntDesign
                        name='pluscircleo'
                        size={25}
                        color={Colors.accentColor}
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
                    <Image
                      style={styles.userImage}
                      source={{ uri: user.userPhoto }}
                    />
                  </View>
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
                    <Image
                      style={styles.userImage}
                      source={{ uri: user.userPhoto }}
                    />
                  </View>
                </View>
              )}
              <Text style={styles.title}>Registration</Text>
              <TextInput
                style={{ marginBottom: 20, ...styles.input }}
                placeholder='Name'
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                value={user.name}
                onChangeText={(value) =>
                  setUser((prevValue) => ({
                    ...prevValue,
                    name: value,
                  }))
                }
              />
              <TextInput
                textContentType='emailAddress'
                style={{ marginBottom: 20, ...styles.input }}
                placeholder='Email'
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                value={user.email}
                onChangeText={(value) =>
                  setUser((prevValue) => ({
                    ...prevValue,
                    email: value,
                  }))
                }
              />
              <View>
                <TextInput
                  style={{ marginBottom: 43, ...styles.input }}
                  placeholder='Password'
                  secureTextEntry={!isShown}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  value={user.password}
                  onChangeText={(value) =>
                    setUser((prevValue) => ({
                      ...prevValue,
                      password: value,
                    }))
                  }
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.showButton}
                  onPress={handleIsShown}
                >
                  <Text style={styles.showButtonText}>
                    {isShown ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={handleSubmitForm}
              >
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
              <View style={styles.toLoginContainer}>
                <Text style={styles.toLoginContainerText}>
                  Do you already have account?{' '}
                </Text>
                <TouchableOpacity
                  style={styles.toLoginButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.toLoginButtonText}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Layout>
  );
}

export default RegistrationScreen;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: -100,
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
    top: -10,
    width: 26,
    height: 26,
    borderRadius: 50,
  },
  form: {
    flex: 1,
    marginTop: 263,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: Colors.background,
    width: '100%',
    height: '100%',
    borderTopStartRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'roboto-bold',
    textAlign: 'center',
    color: Colors.mainTextColor,
    fontSize: 30,
    // fontWeight: 500,
    marginTop: 92,
    marginBottom: 33,
  },
  input: {
    padding: 16,
    width: '100%',
    height: 50,
    backgroundColor: Colors.backgroundGrey,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inputBorderColor,
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
  button: {
    marginBottom: 16,
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
  toLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toLoginContainerText: {
    color: Colors.blueTextColor,
    color: Colors.blueTextColor,
    fontSize: 16,
  },
  toLoginButton: {},
  toLoginButtonText: {
    color: Colors.blueTextColor,
    fontSize: 16,
    // fontWeight: 700,
  },
});
