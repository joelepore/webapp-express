import mysql from 'mysql2';
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

connection.connect(err => {
  if (err) throw err;
  console.log(`Connected to database ${process.env.DB_NAME}`);
})

export default connection;