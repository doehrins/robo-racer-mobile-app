import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite'

import { useColorScheme } from '@/hooks/useColorScheme';
import WorkoutDetailScreen from './WorkoutDetailScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // const initDB = async(db: SQLiteDatabase) => {
  //   console.log('initializing database')
  //   await db.execAsync(`
  //     DROP TABLE IF EXISTS Workouts;
  //     DROP TABLE IF EXISTS Intervals;

  //     CREATE TABLE IF NOT EXISTS Workouts (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       name TEXT NOT NULL,
  //       description TEXT NOT NULL,
  //       totalDistance FLOAT NOT NULL,
  //       totalTime FLOAT NOT NULL,
  //       numIntervals INTEGER NOT NULL,
  //       savedToProfile BOOLEAN NOT NULL
  //     );

  //     INSERT INTO Workouts (name, description, totalDistance, totalTime, numIntervals, savedToProfile)
  //     VALUES ('400m Repeats', 'Good workout', 1600, 360, 4, 1),
  //            ('800m Repeats', 'Great workout', 3600, 750, 6, 1),
  //            ('Mile Run', 'Super fast!', 1600, 360, 1, 1),
  //            ('100m Sprint', 'Quick acceleration', 100, 10, 8, 1);

  //     CREATE TABLE IF NOT EXISTS Intervals (
  //       workoutID INTEGER NOT NULL,
  //       idx INTEGER NOT NULL,
  //       distance FLOAT NOT NULL,
  //       time FLOAT NOT NULL,
  //       PRIMARY KEY (workoutID, idx),
  //       FOREIGN KEY (workoutID)
  //         REFERENCES Workouts (id)
  //           ON DELETE CASCADE
  //     );

  //     INSERT INTO Intervals (workoutID, idx, distance, time)
  //     VALUES (1, 1, 400, 120),
  //            (1, 2, 400, 60),
  //            (1, 3, 400, 120),
  //            (1, 4, 400, 60),
  //            (2, 1, 800, 150),
  //            (2, 2, 400, 100),
  //            (2, 3, 800, 150),
  //            (2, 4, 400, 100),
  //            (2, 5, 800, 150),
  //            (2, 6, 400, 100),
  //            (3, 1, 1600, 360),
  //            (4, 1, 1, 0.1),
  //            (4, 2, 4, 0.3),
  //            (4, 3, 5, 0.3),
  //            (4, 4, 10, 1.3),
  //            (4, 5, 10, 1),
  //            (4, 6, 20, 2.5),
  //            (4, 7, 25, 2.5),
  //            (4, 8, 25, 2);
  //   `)
  // }

  return (
    // <SQLiteProvider databaseName='test.db' onInit={initDB}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="EventDetail" options={{ title: 'Event Detail' }} />
          <Stack.Screen name="WorkoutDetailScreen" options={{ 
            title: "Workout Details",
            headerBackTitle: "Profile",
            headerStyle: { backgroundColor: 'darkgray' },
            headerTitleStyle: { color: 'black' }
          }}/>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    // </SQLiteProvider>
    
  );
}
