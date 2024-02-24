import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebase/config';

import { authSlice } from './authReducer';

export const authSignInUser =
  ({ email, password, name }) =>
  async (dispatch, getState) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await dispatch(
        authSlice.actions.updateUserProfile({
          userId: user.uid,
          name: user.displayName,
          email: email,
          userPhoto: user.photoURL,
        })
      );
    } catch (error) {
      console.log('error', error);
      console.log('error.message', error.message);
    }
  };

export const authSignUpUser =
  ({ email, password, name, userPhoto }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const { uid, displayName } = await auth.currentUser;
      let processedPhoto = '';
      if (userPhoto) {
        const response = await fetch(userPhoto);
        const file = await response.blob();
        const uniquePostId = Date.now().toString();
        const storage = getStorage();
        const storageRef = ref(storage, `userImage/${uniquePostId}`);
        const data = await uploadBytes(storageRef, file).then((snapshot) => {
          return snapshot;
        });

        processedPhoto = await getDownloadURL(storageRef)
          .then((url) => {
            return url;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: processedPhoto,
      });

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          name: displayName,
          email: email,
          userPhoto: processedPhoto,
        })
      );
    } catch (error) {
      console.log('error', error);
      console.log('error.message', error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  await signOut(auth);
  dispatch(authSlice.actions.authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        name: user.displayName,
        userId: user.uid,
        email: user.email,
        userPhoto: user.photoURL,
      };
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
      dispatch(authSlice.actions.authStateChange({ stateChange: true }));
    } else {
      // User is signed out
      // ...
    }
  });
};
