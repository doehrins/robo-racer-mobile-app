import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { garminBlue } from '@/constants/Colors';

type IntervalData = {
  interval: string;
  speed: number;
  distance: number;
};

type EventItemData = {
  id: string;
  date: string;
  timeRange: string;
  distance: string;
  avgSpeed: string;
  maxSpeed: string;
  duration: string;
  intervals: IntervalData[];
};

type EventDetailScreenRouteProp = RouteProp<{ params: { item: EventItemData } }, 'params'>;

const EventDetailScreen = () => {
  const route = useRoute<EventDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params;
  const [selectedTab, setSelectedTab] = useState('speed');

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Event: '+item.date });
  }, [navigation]);

  if (!item || !item.intervals) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  const speedData = {
    labels: item.intervals.map(interval => interval.interval),
    datasets: [
      {
        data: item.intervals.map(interval => interval.speed),
      },
    ],
  };

  const distanceData = {
    labels: item.intervals.map(interval => interval.interval),
    datasets: [
      {
        data: item.intervals.map(interval => interval.distance),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.date}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg Speed</Text>
          <Text style={styles.statValue}>{item.avgSpeed} m/s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max Speed</Text>
          <Text style={styles.statValue}>{item.maxSpeed} m/s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{item.distance} m</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration}</Text>
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
            <Text style={styles.intervalLabel}>{interval.interval}</Text>
            <Text style={styles.intervalValue}>
              {selectedTab === 'speed' ? `${interval.speed} m/s` : `${interval.distance} m`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

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