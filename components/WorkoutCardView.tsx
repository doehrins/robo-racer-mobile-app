import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Workout } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    WorkoutDetailScreen: { workoutDetails: WorkoutProps }
}

interface WorkoutProps {
    workout: Workout
}

export function WorkoutCardView({ workout }: WorkoutProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    return (
        <Pressable
            style={styles.cardContainer}
            onPress={() => navigation.navigate('WorkoutDetailScreen', { workoutDetails: { workout }})}
        >
            <View style={styles.infoContainer}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 5,
                }}>
                    {workout.name}
                </Text>
                <Text>Total Distance: {workout.totalDist}m</Text>
                <Text>Total Time: {workout.totalTime} sec</Text>
                <Text>Intervals: {workout.numIntervals}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#000" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        height: 100,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    infoContainer: {
        // gap: 3
    },
})