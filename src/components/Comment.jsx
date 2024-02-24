import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

import { useSelector } from 'react-redux';
import { selectName } from '../redux/auth/authSelectors';
import { selectUserPhoto } from '../redux/auth/authSelectors';

import { Colors } from '../constants/colors';

export const Comment = ({ comment, userName }) => {
  const name = useSelector(selectName);
  const userPhoto = useSelector(selectUserPhoto);

  return (
    <View
      style={[
        styles.commentContainer,
        name === userName && styles.commentContainerReversed,
      ]}
    >
      {userPhoto ? (
        <View
          style={{
            alignSelf: 'flex-start',
            marginRight: name === userName ? 0 : 16,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.backgroundGrey,
          }}
        >
          <Image
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
            }}
            source={{ uri: userPhoto }}
          ></Image>
        </View>
      ) : (
        <View
          style={{
            alignSelf: 'flex-start',
            marginRight: name === userName ? 0 : 16,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.backgroundGrey,
          }}
        ></View>
      )}
      <View
        style={{
          flex: 1,
          marginRight: name === userName ? 16 : 0,

          padding: 16,
          backgroundColor: Colors.placeholderTextColor,
          borderRadius: 6,
        }}
      >
        <Text>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 30,
  },
  commentContainerReversed: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginBottom: 30,
  },
  image: {
    height: 240,
    width: '100%',
    borderRadius: 8,
  },
  title: {
    marginVertical: 8,
    color: Colors.mainTextColor,
    fontSize: 16,
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
