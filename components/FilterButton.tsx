import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { garminBlue } from '@/constants/Colors'

interface FilterButtonProps {
  onPress: () => void;
}
// calendar icon button to filter events
const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <Ionicons name="calendar" size={20} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: garminBlue,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FilterButton;