import { View, Text, Button, Image, Alert, StyleSheet, Pressable } from 'react-native';


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

          <View style={styles.intervalContainer}>
            <Text>1</Text>
            <Text>1.0</Text>
            <Text>20</Text>
            <Pressable
              style={styles.editButton}
              onPress={() => Alert.alert("Edit button pressed")}
              >
              <Image
                style={{flex: 1}}
                source={require('../../assets/images/pencil-icon.png')}
                resizeMode='contain'
              />
            </Pressable>
          </View>

          <View style={styles.intervalContainer}>
            <Text>2</Text>
            <Text>5.0 </Text>
            <Text>100</Text>
            <Pressable
              style={styles.editButton}
              onPress={() => Alert.alert("Edit button pressed")}
              >
              <Image
                style={{flex: 1}}
                source={require('../../assets/images/pencil-icon.png')}
                resizeMode='contain'
              />
            </Pressable>
          </View>

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

const garminBlue = '#007cc1'

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1, // Expands to fill all vertical space,
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
    height: 400, // update
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
