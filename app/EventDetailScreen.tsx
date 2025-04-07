import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { garminBlue } from '@/globals/constants/Colors';

// Define the interval data interface
type IntervalData = {
  Index: number;
  speed: number;
  Distance: number;
  Time: number;
};

// Define the event item data interface
type EventItemData = {
  id: string;
  date: string;
  timeRange: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: string;
  duration: string;
  intervals: IntervalData[];
};

// Define the route prop type for the EventDetailScreen
type EventDetailScreenRouteProp = RouteProp<{ params: { item: EventItemData } }, 'params'>;

// Define the EventDetailScreen component
const EventDetailScreen = () => {
  const route = useRoute<EventDetailScreenRouteProp>(); // Get the route prop
  const navigation = useNavigation(); // Get the navigation object
  const { item } = route.params; // Extract the item from the route params
  const [selectedTab, setSelectedTab] = useState('speed'); // State to manage the selected tab

  // Set the header title and log the event item when the component mounts
  useEffect(() => {
    navigation.setOptions({ headerTitle: `Event: ${item.date}` });
    console.log('Event Item:', item); // Log the entire event item
  }, [navigation]);

  // If no item or intervals are available, display an error message
  if (!item || !item.intervals || item.intervals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  // Calculate total duration from intervals
  const totalDuration = item.intervals.reduce((sum, interval) => sum + interval.Time, 0);

  // Format total duration as HH:MM:SS
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Prepare data for the speed chart
  const speedData = {
    labels: item.intervals.map((interval, index) => `Interval ${index + 1}`),
    datasets: [
      {
        data: item.intervals.map(interval => {
          const speed = isFinite(interval.speed) ? interval.speed : 0;
          console.log(`Interval ${interval.Index} Speed:`, speed); // Log each speed value
          return speed;
        }),
      },
    ],
  };

  // Prepare data for the distance chart
  const distanceData = {
    labels: item.intervals.map((interval, index) => `Interval ${index + 1}`),
    datasets: [
      {
        data: item.intervals.map(interval => {
          const distance = isFinite(interval.Distance) ? interval.Distance : 0;
          console.log(`Interval ${interval.Index} Distance:`, distance); // Log each distance value
          return distance;
        }),
      },
    ],
  };

  console.log('Speed Data:', speedData); // Log the speed data
  console.log('Distance Data:', distanceData); // Log the distance data

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.date}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg Speed</Text>
          <Text style={styles.statValue}>{isFinite(item.avgSpeed) ? item.avgSpeed : 0} m/s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max Speed</Text>
          <Text style={styles.statValue}>{item.maxSpeed} m/s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{isFinite(item.distance) ? item.distance : 0} m</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{formatDuration(totalDuration)}</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'speed' && styles.activeTab]}
          onPress={() => setSelectedTab('speed')}
        >
          <Text style={[styles.tabText, selectedTab === 'speed' && styles.activeTabText]}>Speed per Interval</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'distance' && styles.activeTab]}
          onPress={() => setSelectedTab('distance')}
        >
          <Text style={[styles.tabText, selectedTab === 'distance' && styles.activeTabText]}>Distance per Interval</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.graphContainer}>
        {selectedTab === 'speed' ? (
          <LineChart
            data={speedData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 124, 193, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: garminBlue,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <LineChart
            data={distanceData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 124, 193, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: garminBlue,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
      </View>
      <View style={styles.intervalDetailsContainer}>
        <Text style={styles.intervalTitle}>Interval Details</Text>
        {item.intervals.map((interval, index) => (
          <View key={index} style={styles.intervalRow}>
            <Text style={styles.intervalLabel}>{`Interval ${index + 1}`}</Text>
            <Text style={styles.intervalValue}>
              {selectedTab === 'speed' ? `${isFinite(interval.speed) ? interval.speed : 0} m/s` : `${isFinite(interval.Distance) ? interval.Distance : 0} m`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Define the styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: garminBlue,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#FFF',
  },
  graphContainer: {
    height: 220,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 16,
  },
  intervalDetailsContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  intervalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  intervalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  intervalLabel: {
    fontSize: 14,
    color: '#888',
  },
  intervalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventDetailScreen;