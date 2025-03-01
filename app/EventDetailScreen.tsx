import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type EventDetailScreenRouteProp = RouteProp<{ params: { item: { date: string; timeRange: string; distance: string; avgSpeed: string; } } }, 'params'>;
// screen that displays more details about selected event
const EventDetailScreen = () => {
  const route = useRoute<EventDetailScreenRouteProp>();
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Detail</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time Range: {item.timeRange}</Text>
      <Text>Distance: {item.distance}</Text>
      <Text>Average Speed: {item.avgSpeed}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default EventDetailScreen;