import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_CONNECTION_URL!,
    ssl: true
  }
});

export default db;