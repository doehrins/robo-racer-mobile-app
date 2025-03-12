import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import AppLayout from '@/components/AppLayout';
import { garminBlue } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const data = {
  maxSpeed: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
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
        data: [100, 200, 300, 400, 500, 600],
        color: (opacity = 1) => `rgba(65, 134, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
  averageDistance: {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        data: [50, 100, 150, 200, 250, 300],
        color: (opacity = 1) => `rgba(134, 244, 65, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
};

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
  const [selectedType, setSelectedType] = useState('max');
  const [selectedMetric, setSelectedMetric] = useState('speed');

  const getChartData = () => {
    if (selectedType === 'max' && selectedMetric === 'speed') {
      return data.maxSpeed;
    } else if (selectedType === 'average' && selectedMetric === 'speed') {
      return data.averageSpeed;
    } else if (selectedType === 'max' && selectedMetric === 'distance') {
      return data.maxDistance;
    } else {
      return data.averageDistance;
    }
  };

  const getYAxisLabel = () => {
    return selectedMetric === 'speed' ? 'MPH' : 'Miles';
  };

  return (
    <AppLayout>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Max" value="max" />
          <Picker.Item label="Average" value="average" />
        </Picker>
        <Picker
          selectedValue={selectedMetric}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMetric(itemValue)}
        >
          <Picker.Item label="Speed" value="speed" />
          <Picker.Item label="Distance" value="distance" />
        </Picker>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{' '}
          {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
        </Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={getChartData()}
            width={screenWidth - 80} 
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero
          />
          <Text style={styles.yAxisLabel}>{getYAxisLabel()}</Text>
          <Text style={styles.xAxisLabel}>Week</Text>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: 150,
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
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
    left: -10,
    top: '40%',
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