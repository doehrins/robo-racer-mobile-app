import { WorkoutDetails, Interval } from '@/globals/constants/types';
import SQLite from 'react-native-sqlite-storage';

// Enable SQLite promise-based API
SQLite.enablePromise(true);

// Database configuration
const database_name = "RoboRacer.db";

// Function to get a database connection
export const getDBConnection = async () => {
  return SQLite.openDatabase({
    name: database_name,
    location: 'default',
  });
};

// Function to create the necessary tables in the database
export const createTables = async (db: SQLite.SQLiteDatabase) => {
  // Create Workout table
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS Workout (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      SavedToProfile BOOLEAN,
      Name TEXT,
      Description TEXT,
      TotalDistance FLOAT,
      TotalTime FLOAT,
      NumIntervals INTEGER
    );`
  );

  // Create Interval table
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS Interval (
      WorkoutConfigurationID INTEGER,
      "Index" INTEGER,
      Speed INTEGER,
      Distance FLOAT,
      FOREIGN KEY (WorkoutConfigurationID) REFERENCES Workout(ID)
    );`
  );

  // Create WorkoutEvent table
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS WorkoutEvent (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      StartDatetime DATETIME,
      WorkoutID INTEGER,
      FOREIGN KEY (WorkoutID) REFERENCES Workout(ID)
    );`
  );

  // Create InitializationStatus table
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS InitializationStatus (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Initialized BOOLEAN
    );`
  );
};

// Function to insert a new workout into the Workout table
export const insertWorkout = async (db: SQLite.SQLiteDatabase, savedToProfile: boolean, totalDistance: number, totalTime: number, numIntervals: number, name?: string, description?: string): Promise<number> => {
  const result = await db.executeSql(
    `INSERT INTO Workout (SavedToProfile, Name, Description, TotalDistance, TotalTime, NumIntervals) VALUES (?, ?, ?, ?, ?, ?);`,
    [savedToProfile, name, description, totalDistance, totalTime, numIntervals]
  );
  console.log("INSERTED", result[0].insertId)
  return result[0].insertId; // Return the ID of the inserted workout
};

// Function to insert a new interval into the Interval table
export const insertInterval = async (db: SQLite.SQLiteDatabase, workoutConfigurationID: number, index: number, speed: number, distance: number) => {
  await db.executeSql(
    `INSERT INTO Interval (WorkoutConfigurationID, "Index", Speed, Distance) VALUES (?, ?, ?, ?);`,
    [workoutConfigurationID, index, speed, distance]
  );
};

// Function to insert a new workout event into the WorkoutEvent table
export const insertWorkoutEvent = async (db: SQLite.SQLiteDatabase, startDatetime: string, workoutID: number) => {
  await db.executeSql(
    `INSERT INTO WorkoutEvent (StartDatetime, WorkoutID) VALUES (?, ?);`,
    [startDatetime, workoutID]
  );
};

// Function to fetch all workouts from the Workout table
export const getWorkouts = async (db: SQLite.SQLiteDatabase): Promise<WorkoutDetails[]> => {
  const results = await db.executeSql(`SELECT * FROM Workout;`);
  const rawData = results[0].rows.raw(); // Get the raw data of the rows

  // Transform the raw data to fit the WorkoutDetails type
  // Set defaults if null
  const transformedData: WorkoutDetails[] = rawData.map((item) => ({
    id: item.ID, 
    name: item.Name || '', 
    description: item.Description || '', 
    totalDistance: item.TotalDistance || 0, 
    totalTime: item.TotalTime || 0, 
    numIntervals: item.NumIntervals || 0, 
    savedToProfile: !!item.SavedToProfile,
  }));

  return transformedData; 
};

// Function to fetch all workouts that are saved to profile from the Workout table
export const getProfileWorkouts = async (db: SQLite.SQLiteDatabase): Promise<WorkoutDetails[]> => {
  const results = await db.executeSql(`SELECT * FROM Workout WHERE SavedToProfile = true;`);
  const rawData = results[0].rows.raw(); // Get the raw data of the rows

  // Transform the raw data to fit the WorkoutDetails type
  // Set defaults if null
  const transformedData: WorkoutDetails[] = rawData.map((item) => ({
    id: item.ID, 
    name: item.Name || '', 
    description: item.Description || '', 
    totalDistance: item.TotalDistance || 0, 
    totalTime: item.TotalTime || 0, 
    numIntervals: item.NumIntervals || 0, 
    savedToProfile: !!item.SavedToProfile,
  }));
  console.log("results:", results)
  console.log("results[0].rows:", results[0].rows)

  return transformedData; 
};

// Function to fetch one specific workout from the Workout table and transform it to fit the WorkoutDetails type
export const getWorkoutByID = async (db: SQLite.SQLiteDatabase, id: number): Promise<WorkoutDetails | null> => {
  const results = await db.executeSql(`SELECT * FROM Workout WHERE ID = ?;`, [id]);
  const rawData = results[0].rows.raw(); // Get the raw data of the rows

  if (rawData.length === 0) {
    // If no workout is found, return null
    return null;
  }

  // Transform the raw data to fit the WorkoutDetails type
  const workout: WorkoutDetails = {
    id: rawData[0].ID,
    name: rawData[0].Name || '',
    description: rawData[0].Description || '',
    totalDistance: rawData[0].TotalDistance || 0,
    totalTime: rawData[0].TotalTime || 0,
    numIntervals: rawData[0].NumIntervals || 0,
    savedToProfile: !!rawData[0].SavedToProfile,
  };

  return workout;
};

// Function to fetch all intervals for a specific workout from the Interval table
export const getIntervals = async (db: SQLite.SQLiteDatabase, workoutConfigurationID: number): Promise<Interval[]> => {
  const results = await db.executeSql(`SELECT * FROM Interval WHERE WorkoutConfigurationID = ?;`, [workoutConfigurationID]);
  const rawData = results[0].rows.raw(); 

  // Transform the raw data to fit the Interval type
  const transformedData: Interval[] = rawData.map((item) => ({
    workoutID: item.WorkoutConfigurationID, 
    idx: item.Index,
    speed: item.Speed || 0, 
    distance: item.Distance || 0, 
  }));

  return transformedData; 
};

// Function to fetch all workout events from the WorkoutEvent table
export const getWorkoutEvents = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql(`SELECT * FROM WorkoutEvent;`);
  const workoutEvents = results[0].rows.raw();

  // Fetch intervals for each workout event
  for (const event of workoutEvents) {
    const intervalResults = await db.executeSql(`SELECT * FROM Interval WHERE WorkoutConfigurationID = ?;`, [event.WorkoutID]);
    const intervals = intervalResults[0].rows.raw().map(interval => ({
      ...interval,
      speed: interval.Distance / interval.Time // Calculate speed
    }));

    // Calculate average speed and total distance
    const totalDistance = intervals.reduce((sum, interval) => sum + interval.Distance, 0);
    const avgSpeed = intervals.length > 0 ? (intervals.reduce((sum, interval) => sum + interval.speed, 0) / intervals.length).toFixed(2) : '0'; // this might break

    // Extract date and time from StartDatetime
    const startDatetime = new Date(event.StartDatetime);
    event.date = startDatetime.toLocaleDateString('en-US');
    event.startTime = startDatetime.toLocaleTimeString('en-US');

    event.intervals = intervals;
    event.avgSpeed = parseFloat(avgSpeed); // Ensure avgSpeed is a number
    event.distance = parseFloat(totalDistance.toFixed(2)); // Ensure distance is a number
  }

  return workoutEvents;
}

export const removeWorkoutFromProfile = async(db: SQLite.SQLiteDatabase, workoutID: number) => {
  const results = await db.executeSql(`UPDATE Workout SET SavedToProfile = false WHERE id = ${workoutID};`)
  // console.log("remove workout from profile results:", results[0].rows.item(0))
}

// Function to insert pre-existing data into the Workout, Interval, and WorkoutEvent tables
export const insertPreExistingData = async (db: SQLite.SQLiteDatabase) => {
  // Delete existing data
  await db.executeSql(`DELETE FROM Workout;`);
  await db.executeSql(`DELETE FROM Interval;`);
  await db.executeSql(`DELETE FROM WorkoutEvent;`);

  // Insert Workouts
  const workout1ID = await insertWorkout(db, true, 5.0, 30.0, 3, 'Morning Run', 'A nice morning run');
  const workout2ID = await insertWorkout(db, true, 10.0, 60.0, 5, 'Evening Run', 'A nice evening run');
  const workout3ID = await insertWorkout(db, true, 15.0, 90.0, 7, 'Weekend Run', 'A long weekend run');

  // Insert Intervals for Workout 1
  await insertInterval(db, workout1ID, 1, 1, 1.5);
  await insertInterval(db, workout1ID, 2, 5, 1.5);
  await insertInterval(db, workout1ID, 3, 8, 2.0);

  // Insert Intervals for Workout 2
  await insertInterval(db, workout2ID, 1, 12, 2.0);
  await insertInterval(db, workout2ID, 2, 12, 2.0);
  await insertInterval(db, workout2ID, 3, 12, 2.0);
  await insertInterval(db, workout2ID, 4, 12, 2.0);
  await insertInterval(db, workout2ID, 5, 12, 2.0);

  // Insert Intervals for Workout 3
  await insertInterval(db, workout3ID, 1, 3, 2.5);
  await insertInterval(db, workout3ID, 2, 3, 2.5);
  await insertInterval(db, workout3ID, 3, 3, 2.5);
  await insertInterval(db, workout3ID, 4, 3, 2.5);
  await insertInterval(db, workout3ID, 5, 3, 2.5);
  await insertInterval(db, workout3ID, 6, 3, 2.5);
  await insertInterval(db, workout3ID, 7, 3, 2.5);

  // Insert Workout Events
  await insertWorkoutEvent(db, '2025-03-01T08:00:00Z', workout1ID);
  await insertWorkoutEvent(db, '2025-03-02T09:00:00Z', workout2ID);
  await insertWorkoutEvent(db, '2025-03-03T10:00:00Z', workout3ID);
};