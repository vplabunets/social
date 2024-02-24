import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useSelector } from 'react-redux';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

import { db } from '../../firebase/config';
import { selectName } from '../../redux/auth/authSelectors';
import { Comment } from '../../components/Comment';
import { Colors } from '../../constants/colors';

const CommentsScreen = ({ route }) => {
  const { postId, uri } = route.params;
  const [_, setIsShowKeyboard] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState('');
  const name = useSelector(selectName);

  useEffect(() => {
    getComments(route.params.postId);
  }, [route.params.postId]);

  function keyboardHide() {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  }
  async function createComment(name, comment) {
    try {
      const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsCollectionRef, { name, comment });
      setComment('');
    } catch (error) {
      console.error('Error getting document:', error);
    }
  }

  const getComments = async (postId) => {
    const q = query(collection(db, 'posts', postId, 'comments'));
    await onSnapshot(q, (querySnapshot) => {
      const allComments = [];
      querySnapshot.forEach((doc) => {
        allComments.push({ ...doc.data(), id: doc.id });
      });
      setComments(allComments);
    });
  };

  return (
    <TouchableWithoutFeedback style={{ width: '100%' }} onPress={keyboardHide}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: uri }} />
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return <Comment comment={item.comment} userName={item.name} />;
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Comment'}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.sendCommentButton}
            onPress={() => createComment(name, comment)}
          >
            <AntDesign name='arrowup' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  image: {
    height: 240,
    width: '100%',
    borderRadius: 8,
    marginBottom: 32,
  },
  commentContainer: {},
  input: {
    color: Colors.placeholderTextColor,
    width: '100%',
    padding: 16,
    marginTop: 32,
    borderRadius: 100,
    height: 50,
    fontSize: 16,
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: Colors.backgroundGrey,
  },
  sendCommentButton: {
    position: 'absolute',
    backgroundColor: Colors.accentColor,
    width: 34,
    height: 34,
    right: 8,
    top: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    borderRadius: 34,
  },
});
