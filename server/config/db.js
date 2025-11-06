const { Pool } = require('pg');
require('dotenv').config();

// Use the raw DATABASE_URL from .env. For NeonDB, the URL often contains
// the ?sslmode=require query param already. We set ssl.rejectUnauthorized = false
// so Node's TLS accepts the Neon server certificate in typical dev setups.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool
  .connect()
  .then(async (client) => {
    console.log("Connected to PostgreSQL");
    try {
      // Try to enable pgcrypto so crypt() is available. Non-fatal if not permitted.
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
      console.log('pgcrypto extension is available (crypt function)');
    } catch (err) {
      console.warn('Could not create/verify pgcrypto extension:', err.message || err);
      console.warn('If your DB restricts extension creation, either enable pgcrypto manually or ensure passwords are verified in-app (bcrypt).');
    } finally {
      client.release();
    }
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1);
  });

module.exports = pool;