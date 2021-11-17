const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://algvyqfq:WwfX5a92oJytSgdJAwk0b_8YSfLZfrL1@fanny.db.elephantsql.com/algvyqfq",
});

module.exports = pool;
