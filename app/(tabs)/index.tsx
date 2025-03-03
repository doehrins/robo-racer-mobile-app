import { useState } from 'react'
import { View, Text, ScrollView, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { IntervalView } from '@/components/IntervalView';
import { IntervalFormView } from '@/components/IntervalFormView'
import { ConnectionView } from '@/components/ConnectionView'
import { Interval } from '@/constants/types'
import { garminBlue } from '@/constants/Colors'


const initialIntervals: Interval[] = [
  {index: 1, time: 1.0, distance: 20},
  {index: 2, time: 5.0, distance: 100},
  {index: 3, time: 8.0, distance: 2000},
]

export default function HomeScreen() {
  const [intervals, setIntervals] = useState(initialIntervals)
  const [showingIntervalFormView, setShowingIntervalFormView] = useState(false)
  const [bluetoothConnectionEstablished, setBluetoothConnectionEstablished] = useState(false)
  const [configurationSuccess, setConfigurationSuccess] = useState(false)

  function handleIntervalSubmit(index: number, newTime: number, newDistance: number) {
    // If adding a new interval
    if (index == intervals.length + 1) {
      setIntervals([...intervals, {index: index, time: newTime, distance: newDistance}]);
      setShowingIntervalFormView(false);
    }
    // If editing an existing interval
    else {
      const newIntervals = intervals.map((interval, i) => {
        if (i == index - 1) {
          // Insert edited interval in proper location
          return {index: index, time: newTime, distance: newDistance};
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
        return {index: int.index - 1, time: int.time, distance: int.distance};
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

      <ConnectionView onConnection={() => setBluetoothConnectionEstablished(true)}/>

      <View style={styles.configContainer}>
        <View style={styles.workoutContainer}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20,
          }}>
            Workout Configuration
          </Text>

          {!configurationSuccess &&
            <ScrollView>
              <View style={styles.intervalsContainer}>
                <View style={styles.headingsContainer}>
                  <Text>Int</Text>
                  <Text>Distance (m)</Text>
                  <Text>Time (sec)</Text>
                </View>

                {intervals.map((interval) => (
                  <IntervalView
                  key={interval.index} // necessary for React to manipulate the DOM
                  interval={interval}
                  onEditSubmit={(newTime: number, newDistance: number) => handleIntervalSubmit(interval.index, newTime, newDistance)}
                  onDelete={() => handleIntervalDeletion(interval.index)}
                  />
                ))}


                {showingIntervalFormView && // Conditionally render form
                  <IntervalFormView
                  index={intervals.length + 1}
                  defaultTime={NaN}
                  defaultDist={NaN}
                  onSubmit={(newTime: number, newDistance: number) => handleIntervalSubmit(intervals.length + 1, newTime, newDistance)}
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
          }

          {configurationSuccess &&
            <View style={styles.configSuccessContainer}>
              <Image
                source={require('../../assets/images/circle-checkmark-icon.png')}
              />

              <Text>Robot configured successfully!</Text>
            </View>
          }
          
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={(bluetoothConnectionEstablished && intervals.length > 0) ? styles.button : styles.disabledButton}
            disabled={configurationSuccess}
            onPress={() => {
              if (bluetoothConnectionEstablished && (intervals.length > 0)) {
                Alert.alert(
                  "Configure Robot?",
                  "Ready to configure the robot with this workout?",
                  [
                    {
                        text: "Cancel",
                        style: 'cancel'
                    },
                    {
                        text: "Configure",
                        onPress: () => {
                          setConfigurationSuccess(true)
                        },
                        style: 'default'
                    }
                  ],
                  { cancelable: false }
                )
              }
              else if (!bluetoothConnectionEstablished) {
                Alert.alert("Establish connection to robot first!")
              }
              else {
                // Connection established, but no intervals added to workout
                Alert.alert("Add intervals to workout!")
              }
            }}
            >
            <Text style={styles.buttonText}>Configure Robot</Text>
          </Pressable>

          <Pressable
            style={intervals.length > 0 ? styles.button : styles.disabledButton}
            disabled={configurationSuccess}
            onPress={() => {
              if (intervals.length > 0) {
                Alert.alert(
                  "Save Workout?",
                  "Are you sure you want to save this workout to your profile?",
                  [
                    {
                        text: "Cancel",
                        style: 'cancel'
                    },
                    {
                        text: "Save",
                        onPress: () => {
                          console.log("Save button pressed")
                        },
                        style: 'default'
                    }
                  ],
                  { cancelable: false }
                )
              } else {
                Alert.alert("Add intervals to workout!")
              }
              
            }
              
            }
            >
            <Text style={styles.buttonText}>Save to Profile</Text>
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
    flex: 1,
    padding: 20,
    marginBottom: 90,
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
  configSuccessContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 18,
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
  disabledButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4883a3',
    opacity: 0.7
  },
  buttonText: {
    color: 'white'
  }
});
