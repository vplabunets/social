import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

import { Ionicons } from '@expo/vector-icons';
import IconButton from '../UI/IconButton';

import { Colors } from '../constants/colors';

const Post = ({
  uri,
  location,
  likes,
  locality,
  title,
  navigation,
  id,
  addLike,
}) => {
  const [commentsQuantity, setCommentsQuantity] = useState(0);
  useEffect(() => {
    getCommentsCount(id);
  }, [id]);

  const getCommentsCount = async (postId) => {
    try {
      const q = collection(db, 'posts', postId, 'comments');
      const querySnapshot = await getDocs(q);
      const commentsCount = querySnapshot.size;
      setCommentsQuantity(commentsCount);
      return commentsCount;
    } catch (error) {
      setCommentsQuantity(0);
      return 0;
    }
  };

  return (
    <View style={styles.postContainer}>
      <Image style={styles.image} source={{ uri: uri }} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.postInfoContainer}>
        <View style={styles.commentsLikesContainer}>
          <TouchableOpacity
            style={styles.commentsContainer}
            onPress={() => navigation.navigate('Comments', { postId: id, uri })}
          >
            <Ionicons
              name='chatbubble-outline'
              size={24}
              color={Colors.accentColor}
            />

            <Text style={styles.comments}>
              {commentsQuantity ? commentsQuantity : 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.likesContainer}
            onPress={() => addLike(id)}
          >
            <Ionicons
              name='thumbs-up-outline'
              size={24}
              color={Colors.accentColor}
            />
            <Text style={styles.likes}>{likes}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => navigation.navigate('Map', { location })}
        >
          <IconButton
            icon='location-outline'
            size={24}
            color={Colors.placeholderTextColor}
          />
          <Text style={styles.location}>{locality}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
  image: {
    flex: 1,
    height: 240,
    width: '100%',
    borderRadius: 8,
  },
  title: {
    marginVertical: 8,
    color: Colors.mainTextColor,
    fontSize: 16,
    fontWeight: 500,
  },
  postInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentsLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  commentsContainer: {
    marginRight: 24,
    flexDirection: 'row',
  },
  comments: {
    marginLeft: 6,
    alignSelf: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    marginLeft: 6,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 6,
    alignSelf: 'center',
  },
});
