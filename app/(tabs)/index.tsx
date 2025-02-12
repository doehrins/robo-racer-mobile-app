import { useState } from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable, ColorValue } from 'react-native';
import { IntervalView } from '@/components/IntervalView';
import { Interval } from '@/constants/types'



const intervals: Interval[] = [
  {index: 1, speed: 1.0, distance: 20},
  {index: 2, speed: 5.0, distance: 100},
  {index: 3, speed: 8.0, distance: 2000},
]

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/garmin-logo.png")}
        resizeMode="contain" // scales image to fit within the given height and width without cropping
      />

      <View style={styles.configContainer}>
        <View style={styles.intervalsContainer}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20,
            }}>
            Intervals
          </Text>

          <View style={styles.headingsContainer}>
            <Text>Int</Text>
            <Text>Speed</Text>
            <Text>Distance</Text>
          </View>

          {intervals.map((interval) => (
            <IntervalView
              key={interval.index} // necessary for React to manipulate the DOM
              index={interval.index}
              speed={interval.speed}
              distance={interval.distance}
              />
          ))}

          <AddIntervalView />

          <Pressable
            style={styles.addIntervalButton}
            onPress={() => Alert.alert("Add Interval button pressed")}
            >
            <Image
              style={{height: '100%', width: 30}}
              source={require('../../assets/images/plus-icon.png')}
              resizeMode='contain'
              />

              <Text style={{color: garminBlue}}>Add Interval</Text>
          </Pressable>
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

function AddIntervalView() {
  const [speed, setSpeed] = useState('');
  const [distance, setDistance] = useState('');

  return (
    <View style={addIntervalViewStyles.intervalContainer}>
      <Text>16</Text>
      <TextInput
        style={addIntervalViewStyles.textInput}
        keyboardType='numeric'
        placeholder='0.0'
        placeholderTextColor={'black'}
        textAlign='center'
        onChangeText={newSpeed => setSpeed(newSpeed)}
        />
      <TextInput
        style={addIntervalViewStyles.textInput}
        keyboardType='numeric'
        placeholder='0'
        placeholderTextColor={'black'}
        textAlign='center'
        onChangeText={newDistance => setDistance(newDistance)}
        />
      <Pressable
        style={addIntervalViewStyles.editButton}
        onPress={() => Alert.alert(`Speed: ${speed} Distance: ${distance}`)}
        >
        <Image
          style={{flex: 1}}
          source={require('../../assets/images/check-mark-icon.png')}
          resizeMode='contain'
        />
      </Pressable>
    </View>
  );
}

const addIntervalViewStyles = StyleSheet.create({
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
  textInput: {
    height: 20,
    width: 40,
    borderWidth: 1,
  },
  editButton: {
    width: 20,
    alignItems: 'center',
  },
});


const garminBlue: ColorValue = '#007cc1'
const customGreen: ColorValue = '#32A114'

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
  intervalsContainer: {
    padding: 20,
    flex: 1,
    gap: 10,
    borderRadius: 15,
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
