import { useState } from 'react'
import { View, Text, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Interval } from '@/constants/types'
import { IntervalFormView } from './IntervalFormView';


interface IntervalViewProps {
  interval: Interval;
  onEditSubmit: (time: number, distance: number) => void
  onDelete: () => void
}


export function IntervalView({ interval, onEditSubmit, onDelete }: IntervalViewProps) {
  const [showingFormView, setShowingFormView] = useState(false);

  return (
    <>
      {!showingFormView && 
        <View style={intervalViewStyles.intervalContainer}>
          <Text>{interval.index}</Text>
          <Text>{interval.distance}</Text>
          <Text>{interval.time}</Text>
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
          defaultTime={interval.time}
          defaultDist={interval.distance}
          onSubmit={(newTime: number, newDistance: number) => {
            setShowingFormView(false);
            onEditSubmit(newTime, newDistance);
          }}
          onDelete={() => 
            Alert.alert(
              "Delete?",
              "Are you sure you want to delete this interval?",
              [
                {
                    text: "Cancel",
                    style: 'cancel'
                },
                {
                    text: "Delete",
                    onPress: () => {
                      setShowingFormView(false);
                      onDelete();
                    },
                    style: 'destructive'
                }
              ],
              { cancelable: false }
            )
          }
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