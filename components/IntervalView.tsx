import { useState } from 'react'
import { View, Text, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Interval } from '@/globals/constants/types'
import { IntervalFormView } from './IntervalFormView';
import React from 'react';


interface IntervalViewProps {
  interval: Interval;
  onEditSubmit: (speed: number, distance: number) => void
  onDelete: () => void
}


export function IntervalView({ interval, onEditSubmit, onDelete }: IntervalViewProps) {
  const [showingFormView, setShowingFormView] = useState(false);
  const paces = [60, 30, 20, 15, 12, 10, 8.5, 7.5, 6.66, 6, 5.5, 5] // indexed by speed, e.g. 2 mph is
                                                                      // paces[2 - 1] == 30 min/mi

  return (
    <>
      {!showingFormView && 
        <View style={intervalViewStyles.intervalContainer}>
          <Text>{interval.idx}</Text>
          <Text>{interval.distance}</Text>
          <Text>{paces[interval.speed - 1]}</Text>
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
          index={interval.idx}
          defaultSpeed={interval.speed}
          defaultDist={interval.distance}
          onSubmit={(newSpeed: number, newDistance: number) => {
            setShowingFormView(false);
            onEditSubmit(newSpeed, newDistance);
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