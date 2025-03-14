import { View, Text, StyleSheet, Pressable } from 'react-native'
import { WorkoutDetails } from '@/globals/constants/types'
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'


interface WorkoutProps {
    workoutDetails: WorkoutDetails;
}

export function WorkoutCardView({ workoutDetails }: WorkoutProps) {
    return (
        <Link 
            href={{
                pathname: '/WorkoutDetailScreen',
                params: { id: workoutDetails.id }
            }}
            asChild
        >
            <Pressable style={styles.cardContainer}>
                <View style={styles.infoContainer}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginBottom: 5,
                    }}>
                        {workoutDetails.name}
                    </Text>
                    <Text>Total Distance: {workoutDetails.totalDist}m</Text>
                    <Text>Total Time: {workoutDetails.totalTime} sec</Text>
                    <Text>Intervals: {workoutDetails.numIntervals}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#000" />
            </Pressable>
        </Link>
        
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