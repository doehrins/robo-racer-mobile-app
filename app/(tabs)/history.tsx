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
import { garminBlue } from '@/globals/constants/Colors';
import { getDBConnection, getWorkoutEvents } from '@/app/database/SQLiteDatabase';

interface State {
  showPicker: boolean;
  selectedDate: Date | null;
  historyData: EventItemData[];
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
  distance: number;
  duration: string;
  intervals: IntervalData[];
  avgSpeed: number;  
  maxSpeed: string; 
}

export default class HistoryScreen extends React.Component<{}, State> {
  state: State = {
    showPicker: false,
    selectedDate: null,
    historyData: []
  };

  // Fetch workout events from the database when the component mounts
  async componentDidMount() {
    const db = await getDBConnection();
    const historyData = await getWorkoutEvents(db);
    console.log('Fetched history data:', historyData);  

    // Ensure intervals property is always an array and id is valid
    const historyDataWithIntervals = historyData.map((item: EventItemData) => {
      const intervals = item.intervals || [];
      const avgSpeed = item.avgSpeed || 0; // Ensure avgSpeed is a number
      const maxSpeed = intervals.length > 0 ? Math.max(...intervals.map(interval => interval.speed)).toFixed(2) : '0';
      return {
        ...item,
        id: item.id || Math.random().toString(), // Ensure id is valid
        intervals,
        avgSpeed, 
        maxSpeed,      
      };
    });
    console.log('Processed history data:', historyDataWithIntervals); // Log processed data
    this.setState({ historyData: historyDataWithIntervals });
  }

  // Format a date object to "MM/DD/YYYY" string
  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  // Filter the history data based on the selected date
  private getFilteredData(): EventItemData[] {
    const { selectedDate, historyData } = this.state;
    if (!selectedDate) return historyData;
    const desiredDateString = this.formatDate(selectedDate);
    return historyData.filter(item => {
      const itemDate = this.formatDate(new Date(item.date));
      return itemDate === desiredDateString;
    });
  }

  // Calculate the maximum speed from the intervals
  private calculateMaxSpeed(intervals: IntervalData[]): number {
    return Math.max(...intervals.map(interval => interval.speed));
  }

  // Calculate the average speed from the intervals
  private calculateAvgSpeed(intervals: IntervalData[]): number {
    const totalSpeed = intervals.reduce((sum, interval) => sum + interval.speed, 0);
    return totalSpeed / intervals.length;
  }

  // Calculate the total distance from the event data
  private calculateTotalDistance(data: EventItemData[]): number {
    return data.reduce((total, item) => total + item.distance, 0);
  }

  // Calculate the average speed for the day from the event data
  private calculateAvgSpeedForDay(data: EventItemData[]): string {
    const totalSpeed = data.reduce((total, item) => total + this.calculateAvgSpeed(item.intervals), 0);
    return (totalSpeed / data.length).toFixed(2);
  }

  // Handle the press event for the calendar button
  private onPressCalendar = () => {
    this.setState({ showPicker: true });
  };

  // Handle the date change event from the date picker
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

  // Clear the selected date
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
                  avgSpeed={item.avgSpeed}
                  maxSpeed={item.maxSpeed}
                  duration={item.duration}
                  intervals={item.intervals}
                />
              )}
              keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
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