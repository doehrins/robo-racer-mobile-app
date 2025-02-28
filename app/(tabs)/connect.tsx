// import React, { useEffect, useState } from "react";
// import { 
//   View, Text, TouchableOpacity, Image, StyleSheet, FlatList, 
//   PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert 
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// // import BleManager from "react-native-ble-manager";
// import { garminBlue } from '@/constants/Colors'

// export default function ConnectScreen() {
//   const [devices, setDevices] = useState<{ id: string; name?: string }[]>([]);

//   // Request Bluetooth permissions (Android 12+)
//   const requestBluetoothPermissions = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         ]);

//         if (
//           granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
//           granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
//           granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log("Bluetooth permissions granted!");
//         } else {
//           Alert.alert("Permission Denied", "Bluetooth permissions are required to scan for devices.");
//           console.log("Bluetooth permissions denied.");
//         }
//       } catch (error) {
//         console.error("Error requesting Bluetooth permissions:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     // Start BLE Manager
//     BleManager.start({ showAlert: false })
//       .then(() => console.log("Bluetooth Manager started!"))
//       .catch(error => console.error("Failed to start Bluetooth:", error));

//     // Get BLE Manager module
//     const BleManagerModule = NativeModules.BleManager;
//     const bleEmitter = new NativeEventEmitter(BleManagerModule);

//     // Handle discovered devices
//     const handleDiscoverPeripheral = (device: { id: string; name?: string }) => {
//       console.log(`Device Found: ID=${device.id}, Name=${device.name || "Unknown Device"}`);

//       setDevices(prevDevices => {
//         const exists = prevDevices.some(d => d.id === device.id);
//         return exists ? prevDevices : [...prevDevices, device];
//       });
//     };

//     // Attach BLE scan event listener
//     bleEmitter.addListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral);

//     // Request Bluetooth permissions on mount
//     requestBluetoothPermissions();

//     // Cleanup function: Remove event listener when component unmounts
//     return () => {
//       bleEmitter.removeAllListeners("BleManagerDiscoverPeripheral");
//     };
//   }, []);

//   // Start scanning for BLE devices
//   const scanForDevices = async () => {
//     console.log("Scan button clicked!");

//     try {
//       await BleManager.scan([], 10, true); // Scan for all devices for 10 seconds
//       console.log("Scanning started...");
//     } catch (error) {
//       console.error("Bluetooth Scan Error:", error);
//       Alert.alert("Scan Failed", "Could not start Bluetooth scanning. Check permissions and try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Garmin Logo */}
//       <Image
//         style={styles.logo}
//         source={require("../../assets/images/garmin-logo.png")}
//         resizeMode="contain" // scales image to fit within the given height and width without cropping
//       />

//       {/* Bluetooth Icon */}
//       <Ionicons name="bluetooth" size={80} color="#007AFF" style={styles.bluetoothIcon} />

//       {/* Connect Button */}
//       <TouchableOpacity style={styles.connectButton} onPress={scanForDevices}>
//         <Text style={styles.connectButtonText}>Connect to Robot</Text>
//       </TouchableOpacity>

//       {/* List of Scanned Devices */}
//       <FlatList
//         data={devices}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <Text style={styles.deviceText}>{item.name || "Unknown Device"} (ID: {item.id})</Text>
//         )}
//       />
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//   },
//   logo: {
//     width: 200,
//     height: 55,
//     alignSelf: 'flex-start',
//     marginTop: 50,
//   },
//   bluetoothIcon: {
//     marginTop: 200,
//     marginBottom: 20,
//     color: garminBlue
//   },
//   connectButton: {
//     backgroundColor: "#F0F0F0",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3, // for Android shadow
//     marginBottom: 20,
//   },
//   connectButtonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   deviceText: {
//     fontSize: 14,
//     color: "#333",
//     marginTop: 5,
//   },
// });