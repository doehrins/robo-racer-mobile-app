import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { garminBlue } from '@/globals/constants/Colors';

interface FilterTagProps {
  date: string;
  onClear: () => void;
}
// Tag that shows the date and a close icon to clear the filter
const FilterTag: React.FC<FilterTagProps> = ({ date, onClear }) => {
  return (
    <TouchableOpacity style={styles.filterTag} onPress={onClear}>
      <Text style={styles.filterTagText}>{date}</Text>
      <Ionicons name="close-circle" size={18} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: garminBlue,
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
});

export default FilterTag;