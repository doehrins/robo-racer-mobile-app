import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AppLayout from '@/components/AppLayout';
import { garminBlue } from '@/globals/constants/Colors';

// Get the screen width for responsive design
const screenWidth = Dimensions.get('window').width;

// Tempory dummy data for the charts
const data = {
  maxSpeed: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [6.0, 6.5, 5.5, 8.0, 8.5, 9.0],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
  averageSpeed: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [4.0, 5.0, 3.5, 6.0, 6.5, 7.8],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
  maxDistance: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [3, 3, 4, 5, 5, 6],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
  averageDistance: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [1, 2, 2, 3, 3, 4],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
};

// Define the chart configuration
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

// Define the graph configurations
const graphs = {
  maxSpeed: { title: 'Max Speed (m/s)', data: data.maxSpeed, yAxisLabel: 'm/s' },
  averageSpeed: { title: 'Average Speed (m/s)', data: data.averageSpeed, yAxisLabel: 'm/s' },
  maxDistance: { title: 'Max Distance (km)', data: data.maxDistance, yAxisLabel: 'km' },
  averageDistance: { title: 'Average Distance (km)', data: data.averageDistance, yAxisLabel: 'km' },
};

// Define the type for the graph keys
type GraphKey = keyof typeof graphs;

// Define the MetricScreen component
export default function MetricScreen() {
  const [selectedMetric, setSelectedMetric] = useState<'average' | 'max'>('average'); // State to manage the selected metric
  const [selectedType, setSelectedType] = useState<'speed' | 'distance'>('speed'); // State to manage the selected type

  // Function to get the graph key based on the selected metric and type
  const getGraphKey = (): GraphKey => {
    return `${selectedMetric}${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` as GraphKey;
  };

  const graphKey = getGraphKey(); // Get the current graph key
  const graph = graphs[graphKey]; // Get the current graph configuration

  // Define summary values for speed and distance
  const summarySpeed = selectedMetric === 'average' ? '3.8 m/s' : '4.0 m/s';
  const summaryDistance = selectedMetric === 'average' ? '5.1 km' : '6.0 km';

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
              data={graph.data}
              width={screenWidth - 80} // Adjusted width to fit better
              height={200} // Adjusted height to fit better
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
            />
            <Text style={styles.yAxisLabel}>{graph.yAxisLabel}</Text>
            <Text style={styles.xAxisLabel}>Week</Text>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

// Define the styles for the component
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