import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Garmin logo */}
      <Image
        style={styles.logo}
        source={require('../assets/images/garmin-logo.png')}
        resizeMode="contain"
      />
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
  },
});

export default AppLayout;