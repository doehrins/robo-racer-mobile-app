import { useState } from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable } from 'react-native';

interface IntervalFormViewProps {
    index: number;
    defaultTime: number;
    defaultDist: number;
    onSubmit: (time: number, distance: number) => void;
    onDelete: () => void;
}

export function IntervalFormView({ index, defaultTime, defaultDist, onSubmit, onDelete }: IntervalFormViewProps) {
    let defaultTimeValue: String = '';
    let defaultDistValue: String = '';

    // Check if form is in edit mode
    if (!Number.isNaN(defaultTime) && !Number.isNaN(defaultDist)) {
        // Populate existing data
        defaultTimeValue = defaultTime.toString();
        defaultDistValue = defaultDist.toString();
    }

    const [time, setTime] = useState(defaultTimeValue);
    const [distance, setDistance] = useState(defaultDistValue);


    function handleIntervalSubmit(time: String, distance: String) {
        // Validate input
        let timeVal = Number(time)
        let distanceVal = Number(distance)

        if (!timeVal || !distanceVal) {
            Alert.alert(`invalid time or distance`)
            return
        }

        // Pass new interval data back up to parent
        onSubmit(timeVal, distanceVal)
    }

    return (
        <View style={styles.intervalContainer}>
            <Pressable
                style={styles.button}
                onPress={() => onDelete()}
                >
                <Image 
                    style={{flex: 1}}
                    source={require('../assets/images/trashcan-icon.png')}
                    resizeMode='contain'
                    />
            </Pressable>

            <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                value={time}
                placeholder='0.0'
                placeholderTextColor={'lightgray'}
                textAlign='center'
                onChangeText={newTime => setTime(newTime)}
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
                onPress={() => handleIntervalSubmit(time, distance)}
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