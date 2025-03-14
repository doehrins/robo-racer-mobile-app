import { getDBConnection, createTables, insertPreExistingData } from './SQLiteDatabase';

export const initializeDatabase = async () => {
  try {
    const db = await getDBConnection();
    console.log('Database connection established');
    await createTables(db);
    console.log('Tables created');
    await insertPreExistingData(db);
    console.log('Pre-existing data inserted');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};