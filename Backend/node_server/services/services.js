export async function Register_User(pool, data) {

  try {
    const [result] = await pool.execute(
      "INSERT INTO ambulance_driver_auth (driver_name, driver_email, password) VALUES (?, ?, ?)",
      [data.user_name, data.email, data.password]
    );

    return result.insertId;
  }
  catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("User ID already exists");
    } else {
      throw error;
    }
  }

}

export async function Authenticate_User(pool, login_data) {

  try {

    console.log("\n\nThis is Login Email: " + login_data.email);
    console.log("This is Login Password: " + login_data.password + "\n\n");

    const [rows] = await pool.execute(
      "SELECT * FROM ambulance_driver_auth WHERE driver_email = ?",
      [login_data.email]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    // console.log("Login Data From Database : " + rows[0]);
    
    return rows[0];

  }
  catch (error) {
    console.log("Data not found in driver table");
  }

}


export async function getNearBySignals(pool, region_name) {
  const sql = `
    SELECT signal_topic, latitude, longitude, region 
    FROM traffic_signals 
    WHERE region = ?
  `;
  const [rows] = await pool.query(sql, [region_name]);
  return rows;
}
