import { View, Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/garmin-logo.png")}
        style={styles.logo}
        resizeMode="contain" // scales image to fit within the given height and width without cropping
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1, // Expands to fill all vertical space
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 55,
    paddingLeft: 20,
  },
});
