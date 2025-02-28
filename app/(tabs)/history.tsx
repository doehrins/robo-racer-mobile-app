import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent
} from '@react-native-community/datetimepicker';

type HistoryItem = {
  id: string;
  date: string;       
  timeRange: string;  
  distance: string;   
  avgSpeed: string;   
};

interface State {
  showPicker: boolean;
  selectedDate: Date | null;
}

export default class HistoryScreen extends React.Component<{}, State> {
  state: State = {
    showPicker: false,
    selectedDate: null
  };

  private historyData: HistoryItem[] = [
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

  private getFilteredData(): HistoryItem[] {
    const { selectedDate } = this.state;
    if (!selectedDate) return this.historyData;
    const desiredDateString = this.formatDate(selectedDate);
    return this.historyData.filter(item => item.date === desiredDateString);
  }

  private renderHistoryItem = ({ item }: ListRenderItemInfo<HistoryItem>) => (
    <View style={styles.historyCard}>
      <View style={styles.historyCardContent}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.timeText}>{item.timeRange}</Text>
        <Text style={styles.distanceText}>{item.distance}</Text>
        <Text style={styles.speedText}>{item.avgSpeed}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </View>
  );

  // Datepicker appears upon pressing calendar button
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

 // Reset date filter
  private clearDateSelection = () => {
    this.setState({ selectedDate: null });
  };

  render() {
    const { showPicker, selectedDate } = this.state;
    const filteredData = this.getFilteredData();
    const selectedDateString = selectedDate ? this.formatDate(selectedDate) : '';

    return (
      <View style={styles.container}>
        {/* Garmin logo */}
        <Image
          style={styles.logo}
          source={require("../../assets/images/garmin-logo.png")}
          resizeMode="contain"
        />

        {/* Big gray rectangle */}
        <View style={styles.grayArea}>
          {/* tag-style button for clearing date filter */}
          {selectedDate && (
            <TouchableOpacity
              style={styles.filterTag}
              onPress={this.clearDateSelection}
            >
              <Text style={styles.filterTagText}>{selectedDateString}</Text>
              <Ionicons name="close-circle" size={18} color="white" />
            </TouchableOpacity>
          )}

          {/* Calendar icon button for filtering event by date */}
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={this.onPressCalendar}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* No events message if nothing matches */}
          {selectedDate && filteredData.length === 0 ? (
            <Text style={styles.noEventsText}>No events for {selectedDateString}</Text>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={this.renderHistoryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Native DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={this.onChangeDate}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  grayArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  // filtering tag-style button
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  filterTagText: {
    color: 'white',
    marginRight: 6,
    fontWeight: 'bold',
  },
  // calendar button
  filterButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
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
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#555',
  },
});
