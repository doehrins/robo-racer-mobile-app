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

interface State {
  showPicker: boolean;
  selectedDate: Date | null;
}

interface EventItemData {
  id: string;
  date: string;
  timeRange: string;
  distance: string;
  avgSpeed: string;
}

export default class HistoryScreen extends React.Component<{}, State> {
  state: State = {
    showPicker: false,
    selectedDate: null
  };
  // temporarily hard-coded data
  private historyData: EventItemData[] = [
    { id: '1', date: '02/07/2025', timeRange: '10:34:12 - 10:40:09', distance: '1000 m', avgSpeed: '2.8 m/s' },
    { id: '2', date: '02/08/2025', timeRange: '09:10:00 - 09:25:30', distance: '2000 m', avgSpeed: '3.1 m/s' },
    { id: '3', date: '02/09/2025', timeRange: '14:00:00 - 14:10:00', distance: '1500 m', avgSpeed: '2.5 m/s' },
    { id: '4', date: '02/09/2025', timeRange: '14:00:00 - 14:10:00', distance: '1500 m', avgSpeed: '2.5 m/s' },
    { id: '5', date: '02/09/2025', timeRange: '14:00:00 - 14:10:00', distance: '1500 m', avgSpeed: '2.5 m/s' },
  ];

  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }
  // filter data by selected date
  private getFilteredData(): EventItemData[] {
    const { selectedDate } = this.state;
    if (!selectedDate) return this.historyData;
    const desiredDateString = this.formatDate(selectedDate);
    return this.historyData.filter(item => item.date === desiredDateString);
  }

  private onPressCalendar = () => {
    this.setState({ showPicker: true });
  };
  // handle date selection
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

    return (
      <AppLayout>
        {/* Big gray rectangle */}
        <View style={styles.grayArea}>
          {/* tag-style button for clearing date filter */}
          {selectedDate && (
            <FilterTag date={selectedDateString} onClear={this.clearDateSelection} />
          )}

          <View style={styles.filterButtonContainer}>
            <FilterButton onPress={this.onPressCalendar} />
          </View>
          {/* No events message if nothing matches */}
          {selectedDate && filteredData.length === 0 ? (
            <Text style={styles.noEventsText}>No events for {selectedDateString}</Text>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => (
                <EventItem
                  id={item.id}
                  date={item.date}
                  timeRange={item.timeRange}
                  distance={item.distance}
                  avgSpeed={item.avgSpeed}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        {/* Native DateTimePicker */}
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
  filterButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
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