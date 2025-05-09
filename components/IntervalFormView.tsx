import { useState } from 'react'
import React from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface IntervalFormViewProps {
    index: number;
    defaultPace: number;
    defaultDist: number;
    onSubmit: (pace: number, distance: number) => void;
    onDelete: () => void;
}

export function IntervalFormView({ index, defaultPace, defaultDist, onSubmit, onDelete }: IntervalFormViewProps) {
    let defaultPaceValue: string = '';
    let defaultDistValue: string = '';

    // Check if form is in edit mode
    if (!Number.isNaN(defaultPace) && !Number.isNaN(defaultDist)) {
        // Populate existing data
        defaultPaceValue = defaultPace.toString();
        defaultDistValue = defaultDist.toString();
    }

    const [pace, setPace] = useState(defaultPaceValue);
    const [distance, setDistance] = useState(defaultDistValue);


    function handleIntervalSubmit(pace: String, distance: String) {
        // Validate input
        let paceVal = Number(pace)
        let distanceVal = Number(distance)

        if (!paceVal || !distanceVal) {
            Alert.alert(`invalid pace or distance`)
            return
        }

        // Pass new interval data back up to parent
        onSubmit(paceVal, distanceVal)
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
                value={distance}
                placeholder='0'
                placeholderTextColor={'lightgray'}
                textAlign='center'
                onChangeText={newDistance => setDistance(newDistance)}
            />

            <Dropdown
                labelField="label"
                valueField="value"
                data={[
                    { label: "1", value: 1 },
                    { label: "2", value: 2 }
                ]}
                value={pace.toString()}
                onChange={item => {
                    setPace(item.value);
                }}
            />

            <Pressable
                style={styles.button}
                onPress={() => handleIntervalSubmit(pace, distance)}
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