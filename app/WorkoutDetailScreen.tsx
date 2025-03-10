import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Workout } from '@/constants/types'

type WorkoutDetailScreenRouteProp = RouteProp<{ params: { workoutDetails: {workout: Workout} }}, 'params'>

const WorkoutDetailScreen = () => {
    const route = useRoute<WorkoutDetailScreenRouteProp>()
    const { workout } = route.params.workoutDetails

    console.log(workout)

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
    }
})

export default WorkoutDetailScreen