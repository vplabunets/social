import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

function Layout({ children }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/images/background-image.png')}
      >
        {children}
      </ImageBackground>
    </View>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    width: '100%',
  },
});
