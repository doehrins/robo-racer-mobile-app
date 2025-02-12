import { View, Text, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Interval } from '@/constants/types'


export function IntervalView({ index, speed, distance }: Interval) {
  return (
    <View style={intervalViewStyles.intervalContainer}>
      <Text>{index}</Text>
      <Text>{speed}</Text>
      <Text>{distance}</Text>
      <Pressable
        style={intervalViewStyles.editButton}
        onPress={() => Alert.alert("Edit button pressed")}
        >
        <Image
          style={{flex: 1}}
          source={require('../assets/images/pencil-icon.png')}
          resizeMode='contain'
        />
      </Pressable>
    </View>
  );
}

const intervalViewStyles = StyleSheet.create({
  intervalContainer: {
    height: 40,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
  },
  editButton: {
    width: 20,
    alignItems: 'center',
  },
});