import { useState } from 'react'
import { View, Text, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Interval } from '@/constants/types'
import { IntervalFormView } from './IntervalFormView';


interface IntervalViewProps {
  interval: Interval;
  onEditSubmit: (speed: number, distance: number) => void
}


export function IntervalView({ interval, onEditSubmit }: IntervalViewProps) {
  const [showingFormView, setShowingFormView] = useState(false);

  return (
    <>
      {!showingFormView && 
        <View style={intervalViewStyles.intervalContainer}>
          <Text>{interval.index}</Text>
          <Text>{interval.speed}</Text>
          <Text>{interval.distance}</Text>
          <Pressable
            style={intervalViewStyles.editButton}
            onPress={() => setShowingFormView(true)}
            >
            <Image
              style={{flex: 1}}
              source={require('../assets/images/pencil-icon.png')}
              resizeMode='contain'
            />
          </Pressable>
        </View>
      }

      {showingFormView &&
        <IntervalFormView
          index={interval.index}
          defaultSpeed={interval.speed}
          defaultDist={interval.distance}
          onSubmit={(newSpeed: number, newDistance: number) => {
            setShowingFormView(false);
            onEditSubmit(newSpeed, newDistance);
          }}
        />
      }
    </>
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