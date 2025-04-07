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
      Time FLOAT,
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
export const insertWorkout = async (db: SQLite.SQLiteDatabase, savedToProfile: boolean, totalDistance: number, totalTime: number, numIntervals: number, name?: string, description?: string) => {
  const result = await db.executeSql(
    `INSERT INTO Workout (SavedToProfile, Name, Description, TotalDistance, TotalTime, NumIntervals) VALUES (?, ?, ?, ?, ?, ?);`,
    [savedToProfile, name, description, totalDistance, totalTime, numIntervals]
  );
  return result[0].insertId; // Return the ID of the inserted workout
};

// Function to insert a new interval into the Interval table
export const insertInterval = async (db: SQLite.SQLiteDatabase, workoutConfigurationID: number, index: number, time: number, distance: number) => {
  await db.executeSql(
    `INSERT INTO Interval (WorkoutConfigurationID, "Index", Time, Distance) VALUES (?, ?, ?, ?);`,
    [workoutConfigurationID, index, time, distance]
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
export const getWorkouts = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql(`SELECT * FROM Workout;`);
  return results[0].rows.raw(); // Return the raw data of the rows
};

// Function to fetch all intervals for a specific workout from the Interval table
export const getIntervals = async (db: SQLite.SQLiteDatabase, workoutConfigurationID: number) => {
  const results = await db.executeSql(`SELECT * FROM Interval WHERE WorkoutConfigurationID = ?;`, [workoutConfigurationID]);
  return results[0].rows.raw(); // Return the raw data of the rows
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
    const avgSpeed = intervals.length > 0 ? (intervals.reduce((sum, interval) => sum + interval.speed, 0) / intervals.length).toFixed(2) : '0';

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
  await insertInterval(db, workout1ID, 1, 10.0, 1.5);
  await insertInterval(db, workout1ID, 2, 10.0, 1.5);
  await insertInterval(db, workout1ID, 3, 10.0, 2.0);

  // Insert Intervals for Workout 2
  await insertInterval(db, workout2ID, 1, 12.0, 2.0);
  await insertInterval(db, workout2ID, 2, 12.0, 2.0);
  await insertInterval(db, workout2ID, 3, 12.0, 2.0);
  await insertInterval(db, workout2ID, 4, 12.0, 2.0);
  await insertInterval(db, workout2ID, 5, 12.0, 2.0);

  // Insert Intervals for Workout 3
  await insertInterval(db, workout3ID, 1, 15.0, 2.5);
  await insertInterval(db, workout3ID, 2, 15.0, 2.5);
  await insertInterval(db, workout3ID, 3, 15.0, 2.5);
  await insertInterval(db, workout3ID, 4, 15.0, 2.5);
  await insertInterval(db, workout3ID, 5, 15.0, 2.5);
  await insertInterval(db, workout3ID, 6, 15.0, 2.5);
  await insertInterval(db, workout3ID, 7, 15.0, 2.5);

  // Insert Workout Events
  await insertWorkoutEvent(db, '2025-03-01T08:00:00Z', workout1ID);
  await insertWorkoutEvent(db, '2025-03-02T09:00:00Z', workout2ID);
  await insertWorkoutEvent(db, '2025-03-03T10:00:00Z', workout3ID);
};