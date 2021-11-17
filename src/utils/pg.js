const pool = require("../config/pool");

const pg = async (SQL, ...values) => {
  const client = await pool.connect();

  try {
    const data = await client.query(SQL, values);
    return data;
  } catch (error) {
    console.log(error);
  } finally {
    await client.release();
  }
};

module.exports = pg;
