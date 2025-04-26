import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, Alert, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { IntervalView } from '@/components/IntervalView';
import { IntervalFormView } from '@/components/IntervalFormView'
import { ConnectionView } from '@/components/ConnectionView'
import { Interval } from '@/globals/constants/types'
import { garminBlue } from '@/globals/constants/Colors'
import { useLocalSearchParams } from 'expo-router';
import { initializeDatabase } from '../database/initializeDatabase';
import { getDBConnection, getIntervals, insertInterval, insertWorkout, insertWorkoutEvent } from '@/app/database/SQLiteDatabase'
import SQLite from 'react-native-sqlite-storage'

var prevWorkoutID: number = -1
var db: SQLite.SQLiteDatabase

export default function HomeScreen() {
  const [intervals, setIntervals] = useState<Interval[]>([])
  const [workoutSaved, setWorkoutSaved] = useState(false)
  const [showingIntervalFormView, setShowingIntervalFormView] = useState(false)
  const [bluetoothConnectionEstablished, setBluetoothConnectionEstablished] = useState(false)
  const [configurationSuccess, setConfigurationSuccess] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDescription, setWorkoutDescription] = useState("")
  const [promptNameField, setPromptNameField] = useState(false)
  const [workoutID, setWorkoutID] = useState(-1)


  useEffect(() => {
    // Define async function to initialize the database
    const initDB = async () => {
      console.log('Initializing database');
      await initializeDatabase(); // Function that initializes database
      console.log('Database initialized');
      
      db = await getDBConnection();
    };

    initDB(); // Start initialization process
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts


  const {id} = useLocalSearchParams()
  const id_num: number = id ? Number(id) : -1 // convert to integer, search params are passed as strings

  console.log("loading config screen, workoutID:", id);

  // If user is importing a saved workout to config screen
  if (id_num != prevWorkoutID) {
    prevWorkoutID = id_num // update so component re-renders appropriately

    // this needs to await so it actually gets the intervals!
    const importedIntervals = getIntervals(db, id_num);
    console.log("imported intervals:", importedIntervals)
    setWorkoutID(id_num);
    setConfigurationSuccess(false);
    setWorkoutSaved(true);
  }

  function handleIntervalSubmit(index: number, newTime: number, newDistance: number) {
    // If adding a new interval
    if (index == intervals.length + 1) {
      setIntervals([...intervals, {workoutID: -1, idx: index, time: newTime, distance: newDistance}]);
      setShowingIntervalFormView(false);
    }
    // If editing an existing interval
    else {
      const newIntervals = intervals.map((interval, i) => {
        if (i == index - 1) {
          // Insert edited interval in proper location
          return {workoutID: -1, idx: index, time: newTime, distance: newDistance};
        }
        else {
          return interval;
        }
      });
      setIntervals(newIntervals)
    }
    setWorkoutSaved(false)
  }

  function handleIntervalDeletion(index: number) {
    // Remove the interval
    const newIntervals = intervals.filter(int => 
      int.idx != index
    )

    // Update proceeding intervals' indicies
    const newIntervals2 = newIntervals.map(int => {
      if (int.idx > index) {
        // Decrement the interval's index
        return {workoutID: -1, idx: int.idx - 1, time: int.time, distance: int.distance};
      }
      else {
        return int;
      }
    });

    setIntervals(newIntervals2)
    setWorkoutSaved(false)
  }

  const buildWorkout = async(saveToProfile: boolean) => {
    // Calculate total distance and time for workout
    var totalDistance = 0
    var totalTime = 0
    intervals.forEach((interval) => {
      totalDistance += interval.distance;
      totalTime += interval.time;
    })

    // workoutID returned from inserting workout
    const id = await insertWorkout(db, saveToProfile, totalDistance, totalTime, intervals.length, workoutName, workoutDescription);

    intervals.forEach((interval) => {
      insertInterval(db, id, interval.idx, interval.time, interval.distance);
    })

    return id;
  }

  const handleSaveToProfile = async() => {
    const id = await buildWorkout(true);
    
    setWorkoutSaved(true)
    setModalVisible(false)
    setWorkoutID(id)
  }

  const handleConfigRobot = async() => {
    const curDT = new Date().toISOString();
    if (workoutSaved) {
      // Workout already saved to profile
      insertWorkoutEvent(db, curDT, workoutID);
    }
    else {
      const id = await buildWorkout(false);
      insertWorkoutEvent(db, curDT, id);
    }

    setConfigurationSuccess(true);
  }

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: 'white'
    }}>
      <View style={modalVisible ? styles.blurredContainer : styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/garmin-logo.png")}
          resizeMode="contain" // scales image to fit within the given height and width without cropping
          />

        <ConnectionView onConnection={() => setBluetoothConnectionEstablished(true)}/>

        <View style={styles.configContainer}>
          <View style={styles.workoutContainer}>
            <View style={styles.titleContainer}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
              }}>
                Workout Configuration
              </Text>

              {workoutSaved &&
                <Image
                  source={require('../../assets/images/circle-checkmark-icon.png')}
                  resizeMode='contain'
                  style={{
                    height: 25,
                    paddingRight: 10
                  }}
                />
              }
            </View>

            {!configurationSuccess &&
              <View style={styles.intervalsContainer}>
                <View style={styles.headingsContainer}>
                  <Text>Int</Text>
                  <Text>Distance (m)</Text>
                  <Text>Time (sec)</Text>
                </View>

                {intervals.map((interval) => (
                  <IntervalView
                    key={interval.idx} // necessary for React to manipulate the DOM
                    interval={interval}
                    onEditSubmit={(newTime: number, newDistance: number) => handleIntervalSubmit(interval.idx, newTime, newDistance)}
                    onDelete={() => handleIntervalDeletion(interval.idx)}
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
              style={(!bluetoothConnectionEstablished || intervals.length == 0 || configurationSuccess) ? styles.disabledButton : styles.button}
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
                            handleConfigRobot();
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
              style={(intervals.length == 0 || configurationSuccess || workoutSaved) ? styles.disabledButton : styles.button}
              disabled={configurationSuccess || workoutSaved}
              onPress={() => {
                if (intervals.length > 0) {
                  setModalVisible(true)
                } else {
                  Alert.alert("Add intervals to workout!")
                }
              }}
              >
              <Text style={styles.buttonText}>Save to Profile</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType='fade'
        >
          <View style={styles.modalContainer}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 20
            }}>
              Save Workout to Profile
            </Text>
            <Text>Workout Name:</Text>
            <TextInput 
              style={promptNameField ? styles.textInputRequired : styles.textInput}
              placeholder='name'
              placeholderTextColor={promptNameField ? 'red' : 'black'}
              onChangeText={newName => {
                setWorkoutName(newName)
                setPromptNameField(false)
              }}
            />
            <Text>Workout Description:</Text>
            <TextInput 
              style={styles.textInput}
              placeholder='description'
              placeholderTextColor={'black'}
              onChangeText={newDescription => setWorkoutDescription(newDescription)}
            />

            <View style={styles.modalButtonsContainer}>
              <Pressable 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{color: 'red'}}>Cancel</Text>
              </Pressable>

              <Pressable 
                style={styles.modalButton}
                onPress={() => {
                  if (workoutName == "") {
                    setPromptNameField(true)
                  } 
                  else {
                    handleSaveToProfile()
                    console.log("after save to profile:", workoutID)
                  }
                }}
              >
                <Text style={{color: 'blue'}}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 200,
    flex: 1, // Expands to fill all vertical space
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'white',
  },
  blurredContainer: {
    padding: 20,
    paddingBottom: 200,
    flex: 1, // Expands to fill all vertical space
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'white',
    opacity: 0.5
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
  titleContainer: {
    flexDirection: 'row',
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
  },
  modalContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 250,
    marginTop: 250,
    backgroundColor: 'darkgray',
    gap: 10,
    padding: 10,
    borderRadius: 20
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  modalButton: {
    backgroundColor: 'lightgray',
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1
  },
  textInput: {
    borderWidth: 1,
    backgroundColor: 'lightgray',
    height: 30,
    borderRadius: 10,
    padding: 5
  },
  textInputRequired: {
    borderWidth: 1,
    backgroundColor: 'lightgray',
    height: 30,
    borderRadius: 10,
    padding: 5,
    borderColor: 'red'
  }
});
