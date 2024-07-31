const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((e: any) => {
  if (e) {
    console.error("Error connecting to MySQL:", e);
    return;
  }
  console.log("Connected to MySQL");
});

export default connection;
