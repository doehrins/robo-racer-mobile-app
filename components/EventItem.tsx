import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  EventDetailScreen: { item: EventItemProps };
};

interface EventItemProps {
  id: string;
  date: string;
  timeRange: string;
  distance: string;
  avgSpeed: string;
}

const EventItem: React.FC<EventItemProps> = ({ id, date, timeRange, distance, avgSpeed }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // navigate to EventDetailScreen with the selected event item data
  const handlePress = () => {
    navigation.navigate('EventDetailScreen', { item: { id, date, timeRange, distance, avgSpeed } });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.historyCard}>
      <View style={styles.historyCardContent}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.timeText}>{timeRange}</Text>
        <Text style={styles.distanceText}>{distance}</Text>
        <Text style={styles.speedText}>{avgSpeed}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
  },
  historyCardContent: {
    flexDirection: 'column',
    flex: 1,
  },
  dateText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeText: {
    color: '#555',
    marginBottom: 4,
  },
  distanceText: {
    color: '#333',
    marginBottom: 4,
  },
  speedText: {
    color: '#333',
  },
});

export default EventItem;