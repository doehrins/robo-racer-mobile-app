import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  selectedDate: Date | null;
  onPressCalendar: () => void;
  clearDateSelection: () => void;
};
// filter component that shows the selected date and a calendar icon button
const DateFilter: React.FC<Props> = ({
  selectedDate,
  onPressCalendar,
  clearDateSelection,
}) => {
  const selectedDateString = selectedDate
    ? `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`
    : '';

  return (
    <View>
      {selectedDate && (
        <TouchableOpacity style={styles.filterTag} onPress={clearDateSelection}>
          <Text style={styles.filterTagText}>{selectedDateString}</Text>
          <Ionicons name="close-circle" size={18} color="white" />
        </TouchableOpacity>
      )}
      <View style={styles.filterButtonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={onPressCalendar}>
          <Ionicons name="calendar" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default DateFilter;