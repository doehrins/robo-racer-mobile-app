import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AppLayout from '@/components/AppLayout';
import { garminBlue } from '@/globals/constants/Colors';
import { getDBConnection, getWorkouts } from '@/app/database/SQLiteDatabase';

// Get the screen width for responsive design
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: "#007cc1",
  backgroundGradientFrom: "#006ca8",
  backgroundGradientTo: "#009df4",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export default function MetricScreen() {
  const [selectedMetric, setSelectedMetric] = useState<'average' | 'max'>('average'); // state to manage selected metric
  const [selectedType, setSelectedType] = useState<'speed' | 'distance'>('speed'); // state to manage selected type
  const [workoutData, setWorkoutData] = useState<any>(null); // State to store workout data

  // Fetch data from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await getDBConnection();
        const workouts = await getWorkouts(db); // get workouts from the database
        console.log('Fetched workouts:', workouts);

        // Transform the data for charts
        const maxSpeedData = workouts.map((workout) => workout.totalDistance / workout.totalTime);
        const averageSpeedData = workouts.map((workout) => workout.totalDistance / workout.numIntervals); 
        const maxDistanceData = workouts.map((workout) => workout.totalDistance);
        const averageDistanceData = workouts.map((workout) => workout.totalDistance / workout.numIntervals);

        setWorkoutData({
          maxSpeed: {
            labels: workouts.map((_, index) => `${index + 1}`),
            datasets: [{ data: maxSpeedData }],
          },
          averageSpeed: {
            labels: workouts.map((_, index) => `${index + 1}`),
            datasets: [{ data: averageSpeedData }],
          },
          maxDistance: {
            labels: workouts.map((_, index) => `${index + 1}`),
            datasets: [{ data: maxDistanceData }],
          },
          averageDistance: {
            labels: workouts.map((_, index) => `${index + 1}`),
            datasets: [{ data: averageDistanceData }],
          },
        });
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };

    loadData();
  }, []);

  // Get the current graph key
  const getGraphKey = (): keyof typeof workoutData => {
    return `${selectedMetric}${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` as keyof typeof workoutData;
  };

  // Give feedback that data isn't loaded yet
  if (!workoutData) {
    return (
      <AppLayout>
        <Text>Loading data...</Text>
      </AppLayout>
    );
  }

  const graphKey = getGraphKey(); 
  const graph = workoutData[graphKey]; // get the current graph configuration

  // Calculate summary values for speed and distance
  const summarySpeed = selectedMetric === 'average'
    ? (workoutData.averageSpeed.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0) / workoutData.averageSpeed.datasets[0].data.length).toFixed(2) + ' m/s'
    : Math.max(...workoutData.maxSpeed.datasets[0].data).toFixed(2) + ' m/s';

  const summaryDistance = selectedMetric === 'average'
    ? (workoutData.averageDistance.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0) / workoutData.averageDistance.datasets[0].data.length).toFixed(2) + ' km'
    : Math.max(...workoutData.maxDistance.datasets[0].data).toFixed(2) + ' km';

  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Summary Container */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>{selectedMetric === 'average' ? 'Avg Speed' : 'Max Speed'}</Text>
            <Text style={styles.summaryValue}>{summarySpeed}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>{selectedMetric === 'average' ? 'Avg Distance' : 'Max Distance'}</Text>
            <Text style={styles.summaryValue}>{summaryDistance}</Text>
          </View>
        </View>
        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, selectedMetric === 'average' && styles.selectedButton]}
              onPress={() => setSelectedMetric('average')}
            >
              <Text style={[styles.buttonText, selectedMetric === 'average' && styles.selectedButtonText]}>Average</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedMetric === 'max' && styles.selectedButton]}
              onPress={() => setSelectedMetric('max')}
            >
              <Text style={[styles.buttonText, selectedMetric === 'max' && styles.selectedButtonText]}>Maximum</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, selectedType === 'speed' && styles.selectedButton]}
              onPress={() => setSelectedType('speed')}
            >
              <Text style={[styles.buttonText, selectedType === 'speed' && styles.selectedButtonText]}>Speed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedType === 'distance' && styles.selectedButton]}
              onPress={() => setSelectedType('distance')}
            >
              <Text style={[styles.buttonText, selectedType === 'distance' && styles.selectedButtonText]}>Distance</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{graph.title}</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={graph}
              width={screenWidth - 80} 
              height={200} 
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
            />
            <Text style={styles.yAxisLabel}>{graph.yAxisLabel}</Text>
            <Text style={styles.xAxisLabel}>Workout</Text>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    width: '45%',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: garminBlue,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: garminBlue,
  },
  buttonText: {
    fontSize: 14,
    color: '#555',
  },
  selectedButtonText: {
    color: '#FFF',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    width: screenWidth - 40,
  },
  chartWrapper: {
    position: 'relative',
    width: screenWidth - 80,
    height: 220,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  yAxisLabel: {
    position: 'absolute',
    left: -40,
    top: '50%',
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    fontWeight: 'bold',
  },
  xAxisLabel: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: [{ translateX: -20 }],
    fontSize: 14,
    fontWeight: 'bold',
  },
});