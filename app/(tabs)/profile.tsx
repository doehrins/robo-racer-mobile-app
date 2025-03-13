import { StyleSheet, Image, ScrollView, View, Text} from 'react-native';
import { Workout } from '@/globals/constants/types'
import { WorkoutCardView } from '@/components/WorkoutCardView'
import workouts from '@/globals/workouts'


export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.grayContainer}>
        <Text style={styles.subHeading}>Saved Workouts</Text>

        <ScrollView>
          <View style={styles.workoutsContainer}>
            {workouts.map((w, idx) => (
              <WorkoutCardView
                key={idx}
                workout={w}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
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