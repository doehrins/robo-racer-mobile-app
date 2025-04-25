import { getDBConnection, createTables, insertWorkout, getWorkouts, getWorkoutByID, insertInterval, getIntervals, insertWorkoutEvent, getWorkoutEvents } from '../SQLiteDatabase';

describe('SQLiteDatabase Integration Tests', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDBConnection(true); // Use in-memory database
    await createTables(db); // Create tables before running tests
  });

  afterAll(async () => {
    await db.close(); // Close the database connection after tests
  });

  test('should insert a workout and retrieve it by ID', async () => {
    const workoutID = await insertWorkout(db, true, 5000, 1800, 3, 'Test Workout', 'Test Description');
    const workout = await getWorkoutByID(db, workoutID);

    expect(workout).not.toBeNull();
    expect(workout?.id).toBe(workoutID);
    expect(workout?.name).toBe('Test Workout');
    expect(workout?.description).toBe('Test Description');
  });

  test('should insert intervals and retrieve them for a workout', async () => {
    const workoutID = await insertWorkout(db, true, 5000, 1800, 3, 'Test Workout', 'Test Description');

    await insertInterval(db, workoutID, 1, 600, 1000);
    await insertInterval(db, workoutID, 2, 600, 1500);

    const intervals = await getIntervals(db, workoutID);

    expect(intervals.length).toBe(2);
    expect(intervals[0].workoutID).toBe(workoutID);
    expect(intervals[0].idx).toBe(1);
    expect(intervals[0].time).toBe(600);
    expect(intervals[0].distance).toBe(1000);
  });

  test('should retrieve all workouts', async () => {
    await insertWorkout(db, true, 5000, 1800, 3, 'Workout 1', 'Description 1');
    await insertWorkout(db, false, 10000, 3600, 5, 'Workout 2', 'Description 2');

    const workouts = await getWorkouts(db);

    expect(workouts.length).toBe(2);
    expect(workouts[0].name).toBe('Workout 1');
    expect(workouts[1].name).toBe('Workout 2');
  });

  test('should insert and retrieve workout events', async () => {
    const workoutID = await insertWorkout(db, true, 5000, 1800, 3, 'Test Workout', 'Test Description');
    await insertWorkoutEvent(db, '2025-03-01T08:00:00Z', workoutID);

    const events = await getWorkoutEvents(db);

    expect(events.length).toBe(1);
    expect(events[0].WorkoutID).toBe(workoutID);
  });
});