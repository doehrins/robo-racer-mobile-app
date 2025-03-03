import { useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { garminBlue } from '@/constants/Colors'

interface ConnectionViewProps {
    onConnection: () => void;
}

export function ConnectionView({ onConnection }: ConnectionViewProps) {
    const [connectionEstablished, setConnectionEstablished] = useState(false)

    return (
        <View style={styles.container}>

            {!connectionEstablished &&
                <View style={styles.connectionContainer}>
                    <Image
                        source={require("../assets/images/bluetooth-icon.png")}
                        style={{flex: 1}}
                        resizeMode='contain'
                    />

                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            setConnectionEstablished(true)
                            onConnection();
                        }}
                    >
                        <Text style={{
                            color: 'white'
                        }}>
                            Connect to Robot
                        </Text>
                    </Pressable>
                </View>
            }

            {connectionEstablished &&
                <View style={styles.connectionContainer}>
                    <Image
                        source={require("../assets/images/circle-checkmark-icon.png")}
                        style={{flex: 1}}
                        resizeMode='contain'
                    />

                    <Text>Connection established</Text>
                </View>
            }

        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
    padding: 20,
    borderRadius: 20,
    gap: 20,
    backgroundColor: 'lightgray',
  },
  connectionContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  button: {
    padding: 10,
    width: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: garminBlue,
  },
});