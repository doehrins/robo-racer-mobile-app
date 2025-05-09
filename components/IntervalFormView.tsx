import { useState } from 'react'
import React from 'react'
import { View, Text, TextInput, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface IntervalFormViewProps {
    index: number;
    defaultSpeed: number;
    defaultDist: number;
    onSubmit: (pace: number, distance: number) => void;
    onDelete: () => void;
}

export function IntervalFormView({ index, defaultSpeed, defaultDist, onSubmit, onDelete }: IntervalFormViewProps) {
    let defaultDistValue: string = '';
    let defaultPace: number = 0;
    const paces = [60, 30, 20, 15, 12, 10, 8.5, 7.5, 6.66, 6, 5.5, 5] // indexed by speed, e.g. 2 mph is
                                                                      // paces[2 - 1] == 30 min/mi

    // Check if form is in edit mode
    if (!Number.isNaN(defaultDist) && (defaultSpeed >= 1 && defaultSpeed <= 12)) {
        // Populate existing data
        defaultDistValue = defaultDist.toString();
        defaultPace = paces[defaultSpeed - 1]
    }

    const [pace, setPace] = useState(defaultPace);
    const [distance, setDistance] = useState(defaultDistValue);


    function handleIntervalSubmit(pace: number, distance: String) {
        // Validate input
        let distanceVal = Number(distance)
        let speed = paces.findIndex(ele => ele == pace) + 1; // look up the pace in paces array to get speed in mph

        if (!speed || !distanceVal) {
            Alert.alert(`invalid speed or distance`)
            return
        }

        // Pass new interval data back up to parent
        onSubmit(speed, distanceVal)
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
                style={styles.dropdown}
                labelField="label"
                valueField="value"
                placeholder='Select'
                placeholderStyle={styles.placeholder}
                data={[
                    { label: "60", value: 60 }, // 1 mph
                    { label: "30", value: 30 }, // 2 mph
                    { label: "20", value: 20 }, // 3 mph
                    { label: "15", value: 15 }, // 4 mph
                    { label: "12", value: 12 }, // 5 mph
                    { label: "10", value: 10 }, // 6 mph
                    { label: "8.5", value: 8.5 }, // 7 mph
                    { label: "7.5", value: 7.5 }, // 8 mph
                    { label: "6.66", value: 6.66 }, // 9 mph
                    { label: "6", value: 6 }, // 10 mph
                    { label: "5.5", value: 5.5 }, // 11 mph
                    { label: "5", value: 5 }, // 12 mph
                ]}
                value={pace}
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
    dropdown: {
        width: 70,
        borderWidth: 1,
        borderRadius: 4,
        padding: 3,
    },
    placeholder: {
        fontSize: 14
    },
    button: {
        width: 20,
        alignItems: 'center',
    },
});