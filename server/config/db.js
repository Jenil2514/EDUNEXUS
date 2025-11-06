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
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1);
  });

  module.exports = pool;