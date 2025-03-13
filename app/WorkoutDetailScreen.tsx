import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Workout } from '@/globals/constants/types'
import { garminBlue } from '@/globals/constants/Colors';
import { Link } from 'expo-router'

type WorkoutDetailScreenRouteProp = RouteProp<{ params: { workoutDetails: {workout: Workout} }}, 'params'>

const WorkoutDetailScreen = () => {
    const route = useRoute<WorkoutDetailScreenRouteProp>()
    const { workout } = route.params.workoutDetails

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.heading}>{workout.name}</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.subheading}>Details:</Text>
                    <Text>Description: {workout.description}</Text>
                    <Text>Total Distance: {workout.totalDist}m</Text>
                    <Text>Total Time: {workout.totalTime} sec</Text>
                    <Text>Intervals: {workout.numIntervals}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.subheading}>Intervals:</Text>

                    <View style={styles.intervalDescriptors}>
                        <Text>Int</Text>
                        <Text>Distance (m)</Text>
                        <Text>Time (sec)</Text>
                    </View>

                    <View style={styles.intervalsContainer}>
                        {workout.intervals.map((interval) => (
                            <View 
                                key={interval.index}
                                style={styles.intervalContainer}
                            >
                                <Text>{interval.index}</Text>
                                <Text>{interval.distance}</Text>
                                <Text>{interval.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Link
                    dismissTo // goes back in navigation stack until it reaches specified route
                    href={{
                        pathname: '/(tabs)', // config (home) screen
                        params: { id: workout.id } // pass workout id
                    }}
                    asChild // forwards link props to pressable child component
                >
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Configure Robot</Text>
                    </Pressable>
                </Link>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        padding: 10,
        gap: 10,
    },
    heading: {
        fontSize: 40
    },
    infoContainer: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 15,
    },
    subheading: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 10
    },
    intervalDescriptors: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5,
    },
    intervalsContainer: {
        gap: 10,
    },
    intervalContainer: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: garminBlue,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white'
    }
})

export default WorkoutDetailScreen