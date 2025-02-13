import { useState } from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable } from 'react-native';

interface IntervalFormViewProps {
    onSubmit: (speed: number, distance: number) => void
}

export function IntervalFormView({ onSubmit }: IntervalFormViewProps) {
    const [speed, setSpeed] = useState('');
    const [distance, setDistance] = useState('');


    function handleIntervalSubmit(speed: String, distance: String) {
        // Validate input
        let speedVal = Number(speed)
        let distanceVal = Number(distance)

        if (!speedVal || !distanceVal) {
            Alert.alert(`invalid speed or distance`)
            return
        }

        // Pass new interval data back up to parent
        onSubmit(speedVal, distanceVal)
    }

    return (
        <View style={styles.intervalContainer}>
            <Text>16</Text>

            <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                placeholder='0.0'
                placeholderTextColor={'lightgray'}
                textAlign='center'
                onChangeText={newSpeed => setSpeed(newSpeed)}
                />

            <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                placeholder='0'
                placeholderTextColor={'lightgray'}
                textAlign='center'
                onChangeText={newDistance => setDistance(newDistance)}
                />

            <Pressable
                style={styles.button}
                onPress={() => handleIntervalSubmit(speed, distance)}
                >
                <Image
                    style={{flex: 1}}
                    source={require('../assets/images/check-mark-icon.png')}
                    resizeMode='contain'
                    />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        width: 20,
        alignItems: 'center',
    },
});