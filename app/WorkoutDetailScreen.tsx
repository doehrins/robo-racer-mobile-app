import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Workout } from '@/constants/types'

type WorkoutDetailScreenRouteProp = RouteProp<{ params: { workoutDetails: {workout: Workout} }}, 'params'>

const WorkoutDetailScreen = () => {
    const route = useRoute<WorkoutDetailScreenRouteProp>()
    const { workout } = route.params.workoutDetails

    console.log(workout)

    return (
        <View style={styles.container}>
            <Text>{workout.name}</Text>
            <Text>Hello</Text>
            <Text>Testing WorkoutDetailScreen</Text>
            <Text>{workout.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
    }
})

export default WorkoutDetailScreen