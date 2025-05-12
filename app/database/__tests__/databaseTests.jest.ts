import { getDBConnection, createTables, insertWorkout, insertInterval, insertWorkoutEvent, getWorkouts, getIntervals, getWorkoutEvents } from '../SQLiteDatabase';
import SQLite from 'react-native-sqlite-storage';

jest.mock('react-native-sqlite-storage', () => {
  const mockExecuteSql = jest.fn((query, params) => {
    // Mock the result set for sqlite_master queries
    if (query.includes('sqlite_master')) {
      const tableName = params[0];
      const mockResultSet = {
        rows: {
          length: 1,
          item: (index: number) => ({ name: tableName }),
        },
      };
      return Promise.resolve([mockResultSet]); // return a resolved promise with the mock result set
    }
    return Promise.resolve([]); // refault empty result for other queries
  });

  const mockOpenDatabase = jest.fn(() => ({
    executeSql: mockExecuteSql,
  }));

  return {
    enablePromise: jest.fn(),
    openDatabase: mockOpenDatabase,
    __mockExecuteSql: mockExecuteSql, // rxpose the mock for testing
  };
});

describe('createTables', () => {
  let mockDb: any;
  let mockExecuteSql: jest.Mock;

  beforeEach(async () => {
    mockDb = await getDBConnection(true); // use in-memory database for testing
    mockExecuteSql = (SQLite as any).__mockExecuteSql;
    mockExecuteSql.mockClear();
  });

  it('should create all necessary tables', async () => {
    await createTables(mockDb);
  
    // query sqlite_master to check for table existence
    const tableNames = ['Workout', 'Interval', 'WorkoutEvent', 'InitializationStatus'];
    for (const tableName of tableNames) {
      const [resultSet] = await mockDb.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
        [tableName]
      );
  
      // ensure the table exists
      expect(resultSet.rows.length).toBe(1);
      expect(resultSet.rows.item(0).name).toBe(tableName);
    }
  });
});