import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from "pg";

// const connectionConfig = {
//   host: 'localhost',
//   port: 5432,
//   database: 'btp',
//   user: 'nerdchanojas',
//   password: '0710',
//   ssl: false // Disable SSL if needed
// };

// const migrationClient = new pg.Pool(connectionConfig);

const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_CONNECTION_URL!,
    ssl: false
  }
});

// async function main() {
//   console.log('Running migrations...');
  
//   try {
//     await migrate(db, { migrationsFolder: './drizzle' });
//     console.log('Migrations completed successfully!');
//   } catch (error) {
//     console.error('Migration failed:', error);
//   } finally {
//     // Close the database connection
//     await migrationClient.end();
//     process.exit(0);
//   }
// }

// main().catch((err) => {
//   console.error('Unexpected error during migration:', err);
//   process.exit(1);
// });

export default db;