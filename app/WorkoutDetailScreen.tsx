import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { WorkoutDetails, Workout, Interval } from '@/globals/constants/types'
import { garminBlue } from '@/globals/constants/Colors';
import { Link, useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import { useState, useCallback } from 'react'
import { getDBConnection, getWorkoutByID, getIntervals, removeWorkoutFromProfile } from './database/SQLiteDatabase';


const WorkoutDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const workoutID = Number(id)
    const [workout, setWorkout] = useState<Workout>()

    const loadData = async() => {
        const db = await getDBConnection();
        const workoutDetails = await getWorkoutByID(db, workoutID);
        const intervals = await getIntervals(db, workoutID);
        console.log("workoutDetails:", workoutDetails)
        console.log("intervals:", intervals)
        setWorkout({workoutDetails: workoutDetails!, intervals: intervals})
    }

    // Weird React magic... I think it prevents the loadData
    // function from being called when the component re-renders
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // Note that since WorkoutEvents are still reliant on Workouts, we're
    // not actually deleting the Workout. Instead we simply update its 
    // SavedToProfile flag so it doesn't display on the profile screen.
    const handleDeleteWorkout = async() => {
        const db = await getDBConnection();
        await removeWorkoutFromProfile(db, workoutID);
        router.dismiss(); // return to profile screen
    }

    if (!workout) {
        return <Text>Error</Text> // TODO: make this a proper redirect
    }
    else {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.heading}>{workout.workoutDetails.name}</Text>

                    <View style={styles.infoContainer}>
                        <Text style={styles.subheading}>Details:</Text>
                        <Text>Description: {workout.workoutDetails.description}</Text>
                        <Text>Total Distance: {workout.workoutDetails.totalDistance}m</Text>
                        <Text>Total Time: {workout.workoutDetails.totalTime} sec</Text>
                        <Text>Intervals: {workout.workoutDetails.numIntervals}</Text>
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
                                    key={interval.idx}
                                    style={styles.intervalContainer}
                                >
                                    <Text>{interval.idx}</Text>
                                    <Text>{interval.distance}</Text>
                                    <Text style={{marginLeft: 20}}>{interval.time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <Link
                        dismissTo // goes back in navigation stack until it reaches specified route
                        href={{
                            pathname: '/(tabs)', // config (home) screen
                            params: { id: workout.workoutDetails.id } // pass workout id
                        }}
                        asChild // forwards link props to pressable child component
                    >
                        <Pressable style={styles.button}>
                            <Text style={styles.buttonText}>Configure Robot</Text>
                        </Pressable>
                    </Link>

                    <Pressable 
                        style={styles.deleteButton}
                        onPress={() => {
                            Alert.alert(
                                "Delete Workout?",
                                "Are you sure you want to delete this workout? This action cannot be undone.",
                                [
                                    {
                                        text: "Cancel",
                                        style: 'cancel'
                                    },
                                    {
                                        text: "Delete",
                                        onPress: () => {
                                            handleDeleteWorkout();
                                        },
                                        style: 'destructive'
                                    }
                                ]
                            )
                        }}
                    >
                        <Text style={styles.buttonText}>Delete Workout</Text>
                    </Pressable>

                </View>
            </ScrollView>
            
        )
    }
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
        gap: 30,
        backgroundColor: 'white',
        width: '70%',
        padding: 10,
        borderRadius: 10
    },
    button: {
        backgroundColor: garminBlue,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
    },
    deleteButton: {
        backgroundColor: 'darkred',
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