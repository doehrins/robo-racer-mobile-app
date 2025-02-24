import { useState } from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable } from 'react-native';

interface IntervalFormViewProps {
    index: number;
    defaultSpeed: number;
    defaultDist: number;
    onSubmit: (speed: number, distance: number) => void;
}

export function IntervalFormView({ index, defaultSpeed, defaultDist, onSubmit }: IntervalFormViewProps) {
    let defaultSpeedValue: String = '';
    let defaultDistValue: String = '';

    // Check if form is in edit mode
    if (!Number.isNaN(defaultSpeed) && !Number.isNaN(defaultDist)) {
        // Populate existing data
        defaultSpeedValue = defaultSpeed.toString();
        defaultDistValue = defaultDist.toString();
    }

    const [speed, setSpeed] = useState(defaultSpeedValue);
    const [distance, setDistance] = useState(defaultDistValue);


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
            <Text>{index}</Text>

            <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                value={speed}
                placeholder='0.0'
                placeholderTextColor={'lightgray'}
                textAlign='center'
                onChangeText={newSpeed => setSpeed(newSpeed)}
                />

            <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                value={distance}
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