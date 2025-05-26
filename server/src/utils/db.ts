import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'contaltransp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba la conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

testConnection();

export default pool;