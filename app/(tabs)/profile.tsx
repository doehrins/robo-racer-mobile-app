import { StyleSheet, Image, ScrollView, View, Text} from 'react-native';
import { WorkoutDetails } from '@/globals/constants/types'
import { WorkoutCardView } from '@/components/WorkoutCardView'
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router';
import SQLite from 'react-native-sqlite-storage'
import { getDBConnection, getProfileWorkouts } from '../database/SQLiteDatabase';


export default function TabTwoScreen() {
  // const db = useSQLiteContext();
  const [workouts, setWorkouts] = useState<WorkoutDetails[]>([])

  const loadData = async() => {
    const db = await getDBConnection();
    const result = await getProfileWorkouts(db);
    // const result = await db.getAllAsync<WorkoutDetails>('SELECT * FROM Workouts WHERE savedToProfile = true;');
    // setWorkouts(result);
    console.log(result)
  }

  // Weird React magic... I think it prevents the loadData
  // function from being called when the component re-renders
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: 'white'
    }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.grayContainer}>
          <Text style={styles.subHeading}>Saved Workouts</Text>

          <View style={styles.workoutsContainer}>
            {workouts.map((w, idx) => (
              <WorkoutCardView
                key={idx}
                workoutDetails={w}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  heading: {
    marginTop: 30,
    // borderWidth: 4,
    fontWeight: 'bold',
    fontSize: 40,
  },
  grayContainer: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 20,
    gap: 20
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600'
  },
  workoutsContainer: {
    // borderWidth: 4,
    flex: 1,
    gap: 15,
  },
});