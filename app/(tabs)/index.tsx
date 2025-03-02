import { useState } from 'react'
import { View, Text, ScrollView, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { IntervalView } from '@/components/IntervalView';
import { IntervalFormView } from '@/components/IntervalFormView'
import { Interval } from '@/constants/types'
import { garminBlue } from '@/constants/Colors'


const initialIntervals: Interval[] = [
  {index: 1, speed: 1.0, distance: 20},
  {index: 2, speed: 5.0, distance: 100},
  {index: 3, speed: 8.0, distance: 2000},
]

export default function HomeScreen() {
  const [intervals, setIntervals] = useState(initialIntervals)
  const [showingIntervalFormView, setShowingIntervalFormView] = useState(false)

  function handleIntervalSubmit(index: number, newSpeed: number, newDistance: number) {
    // If adding a new interval
    if (index == intervals.length + 1) {
      setIntervals([...intervals, {index: index, speed: newSpeed, distance: newDistance}]);
      setShowingIntervalFormView(false);
    }
    // If editing an existing interval
    else {
      const newIntervals = intervals.map((interval, i) => {
        if (i == index - 1) {
          // Insert edited interval in proper location
          return {index: index, speed: newSpeed, distance: newDistance};
        }
        else {
          return interval;
        }
      });
      setIntervals(newIntervals)
    }
  }

  function handleIntervalDeletion(index: number) {
    // Remove the interval
    const newIntervals = intervals.filter(int => 
      int.index != index
    )

    // Update proceeding intervals' indicies
    const newIntervals2 = newIntervals.map(int => {
      if (int.index > index) {
        // Decrement the interval's index
        return {index: int.index - 1, speed: int.speed, distance: int.distance};
      }
      else {
        return int;
      }
    });

    setIntervals(newIntervals2)
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/garmin-logo.png")}
        resizeMode="contain" // scales image to fit within the given height and width without cropping
      />

      <View style={styles.configContainer}>
        <View style={styles.workoutContainer}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20,
            }}>
            Workout Configuration
          </Text>

          <ScrollView>
            <View style={styles.intervalsContainer}>
              <View style={styles.headingsContainer}>
                <Text>Int</Text>
                <Text>Speed</Text>
                <Text>Distance</Text>
              </View>

              {intervals.map((interval) => (
                <IntervalView
                  key={interval.index} // necessary for React to manipulate the DOM
                  interval={interval}
                  onEditSubmit={(newSpeed: number, newDistance: number) => handleIntervalSubmit(interval.index, newSpeed, newDistance)}
                  onDelete={() => handleIntervalDeletion(interval.index)}
                  />
              ))}


              {showingIntervalFormView && // Conditionally render form
                <IntervalFormView
                  index={intervals.length + 1}
                  defaultSpeed={NaN}
                  defaultDist={NaN}
                  onSubmit={(newSpeed: number, newDistance: number) => handleIntervalSubmit(intervals.length + 1, newSpeed, newDistance)}
                  onDelete={() => {
                    setShowingIntervalFormView(false);
                  }}
                  />
              }

            
              <Pressable
                style={styles.addIntervalButton}
                onPress={() => setShowingIntervalFormView(true)}
                >
                <Image
                  style={{height: '100%', width: 30}}
                  source={require('../../assets/images/plus-icon.png')}
                  resizeMode='contain'
                  />

                <Text style={{color: garminBlue}}>Add Interval</Text>
              </Pressable>  
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.button}
            onPress={() => Alert.alert("Save button pressed")}
            >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => Alert.alert("Add to Profile button pressed")}
            >
            <Text style={styles.buttonText}>Add to Profile</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1, // Expands to fill all vertical space
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 55,
    alignSelf: 'flex-start',
  },
  configContainer: {
    width: '100%',
    height: 600,
    padding: 20,
    borderRadius: 20,
    gap: 20,
    backgroundColor: 'lightgray',
  },
  workoutContainer: {
    flex: 1,
    gap: 10,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  intervalsContainer: {
    flex: 1,
    gap: 10,
    backgroundColor: 'white',
  },
  headingsContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 30,
  },
  addIntervalButton: {
    height: 40,
    padding: 7,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: garminBlue,
    borderStyle: 'dashed',
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: garminBlue,
  },
  buttonText: {
    color: 'white'
  }
});
