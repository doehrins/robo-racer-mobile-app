import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { garminBlue } from '@/globals/constants/Colors';

// Define the navigation parameters for the stack
type RootStackParamList = {
  EventDetailScreen: { item: EventItemData };
};

// Define the interval data interface
interface IntervalData {
  interval: string;
  speed: number;
  distance: number;
}

// Define the event item data interface
interface EventItemData {
  id: string;
  date: string;
  startTime: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: string;
  duration: string;
  intervals: IntervalData[];
}

// Define the props for the EventItem component
interface EventItemProps {
  id: string;
  date: string;
  startTime: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: string;
  duration: string;
  intervals: IntervalData[];
}

// Define the EventItem component
const EventItem: React.FC<EventItemProps> = ({ id, date, startTime, distance, avgSpeed, maxSpeed, duration, intervals }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Handle the press event to navigate to the EventDetailScreen
  const handlePress = () => {
    navigation.navigate('EventDetailScreen', { item: { id, date, startTime, distance, avgSpeed, maxSpeed, duration, intervals } });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.historyCard}>
      <View style={styles.historyCardContent}>
        <View style={styles.row}>
          <Text style={styles.header}>{date}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="access-time" size={20} color={garminBlue} />
          <Text style={styles.text}>{startTime}</Text>
          <MaterialIcons name="directions-walk" size={20} color={garminBlue} />
          <Text style={styles.text}>{distance} km</Text>
          <MaterialIcons name="speed" size={20} color={garminBlue} />
          <Text style={styles.text}>{avgSpeed} m/s</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={garminBlue} />
    </TouchableOpacity>
  );
};

// Define the styles for the component
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  text: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 14,
    color: '#333',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default EventItem;