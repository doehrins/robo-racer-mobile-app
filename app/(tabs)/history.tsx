import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import EventItem from '@/components/EventItem';
import FilterTag from '@/components/FilterTag';
import FilterButton from '@/components/FilterButton';
import DatePicker from '@/components/DatePicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AppLayout from '@/components/AppLayout';
import { garminBlue } from '@/constants/Colors';

interface State {
  showPicker: boolean;
  selectedDate: Date | null;
}

interface IntervalData {
  interval: string;
  speed: number;
  distance: number;
}

interface EventItemData {
  id: string;
  date: string;
  startTime: string;
  distance: string;
  duration: string;
  intervals: IntervalData[];
}

export default class HistoryScreen extends React.Component<{}, State> {
  state: State = {
    showPicker: false,
    selectedDate: null
  };

  private historyData: EventItemData[] = [
    {
      id: '1',
      date: 'March 7, 2025',
      startTime: '10:34',
      distance: '1000',
      duration: '6 min',
      intervals: [
        { interval: 'Interval 1', speed: 2.5, distance: 400 },
        { interval: 'Interval 2', speed: 3.0, distance: 600 },
        { interval: 'Interval 3', speed: 4.0, distance: 200 },
      ],
    },
    {
      id: '2',
      date: 'March 8, 2025',
      startTime: '11:00',
      distance: '1500',
      duration: '8 min',
      intervals: [
        { interval: 'Interval 1', speed: 3.0, distance: 500 },
        { interval: 'Interval 2', speed: 3.5, distance: 700 },
        { interval: 'Interval 3', speed: 4.5, distance: 300 },
      ],
    },
    {
      id: '3',
      date: 'March 9, 2025',
      startTime: '09:15',
      distance: '2000',
      duration: '10 min',
      intervals: [
        { interval: 'Interval 1', speed: 3.5, distance: 600 },
        { interval: 'Interval 2', speed: 4.0, distance: 800 },
        { interval: 'Interval 3', speed: 4.5, distance: 600 },
      ],
    },
    {
      id: '4',
      date: 'March 10, 2025',
      startTime: '14:20',
      distance: '1200',
      duration: '7 min',
      intervals: [
        { interval: 'Interval 1', speed: 2.8, distance: 400 },
        { interval: 'Interval 2', speed: 3.2, distance: 500 },
        { interval: 'Interval 3', speed: 3.6, distance: 300 },
      ],
    },
    {
      id: '5',
      date: 'March 11, 2025',
      startTime: '16:45',
      distance: '1800',
      duration: '9 min',
      intervals: [
        { interval: 'Interval 1', speed: 3.2, distance: 600 },
        { interval: 'Interval 2', speed: 3.8, distance: 800 },
        { interval: 'Interval 3', speed: 4.2, distance: 400 },
      ],
    },
  ];

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private getFilteredData(): EventItemData[] {
    const { selectedDate } = this.state;
    if (!selectedDate) return this.historyData;
    const desiredDateString = this.formatDate(selectedDate);
    return this.historyData.filter(item => item.date === desiredDateString);
  }

  private calculateMaxSpeed(intervals: IntervalData[]): number {
    return Math.max(...intervals.map(interval => interval.speed));
  }

  private calculateAvgSpeed(intervals: IntervalData[]): number {
    const totalSpeed = intervals.reduce((sum, interval) => sum + interval.speed, 0);
    return totalSpeed / intervals.length;
  }

  private calculateTotalDistance(data: EventItemData[]): number {
    return data.reduce((total, item) => total + parseFloat(item.distance), 0);
  }

  private calculateAvgSpeedForDay(data: EventItemData[]): string {
    const totalSpeed = data.reduce((total, item) => total + this.calculateAvgSpeed(item.intervals), 0);
    return (totalSpeed / data.length).toFixed(2);
  }

  private onPressCalendar = () => {
    this.setState({ showPicker: true });
  };

  private onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      this.setState({ showPicker: false });
      return;
    }
    if (date) {
      this.setState({
        selectedDate: date,
        showPicker: false
      });
    }
  };

  private clearDateSelection = () => {
    this.setState({ selectedDate: null });
  };

  render() {
    const { showPicker, selectedDate } = this.state;
    const filteredData = this.getFilteredData();
    const selectedDateString = selectedDate ? this.formatDate(selectedDate) : '';
    const totalDistance = this.calculateTotalDistance(filteredData);
    const avgSpeed = this.calculateAvgSpeedForDay(filteredData);

    return (
      <AppLayout>
        <View style={styles.grayArea}>
          <View style={styles.filterContainer}>
            {selectedDate && (
              <FilterTag date={selectedDateString} onClear={this.clearDateSelection} />
            )}
            <View style={styles.filterButtonContainer}>
              <FilterButton onPress={this.onPressCalendar} />
            </View>
          </View>
          <Text style={styles.sectionHeader}>Training Summary</Text>
          <View style={styles.trainingSummary}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{filteredData.length}</Text>
              <Text style={styles.summaryLabel}>Sessions</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{totalDistance} km</Text>
              <Text style={styles.summaryLabel}>Distance</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{avgSpeed} m/s</Text>
              <Text style={styles.summaryLabel}>Avg Speed</Text>
            </View>
          </View>
          <Text style={styles.sectionHeader}>Event History</Text>
          {selectedDate && filteredData.length === 0 ? (
            <Text style={styles.noEventsText}>No events for {selectedDateString}</Text>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => (
                <EventItem
                  id={item.id}
                  date={item.date}
                  startTime={item.startTime}
                  distance={item.distance}
                  avgSpeed={this.calculateAvgSpeed(item.intervals).toFixed(2)}
                  maxSpeed={this.calculateMaxSpeed(item.intervals).toFixed(2)}
                  duration={item.duration}
                  intervals={item.intervals}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        {showPicker && (
          <DatePicker
            value={selectedDate || new Date()}
            onChange={this.onChangeDate}
          />
        )}
      </AppLayout>
    );
  }
}

const styles = StyleSheet.create({
  grayArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  trainingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: garminBlue,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButtonContainer: {
    marginLeft: 'auto',
  },
  listContent: {
    paddingBottom: 20,
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#555',
  },
});