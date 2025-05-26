import pool from '../utils/db'; 

interface User {
    id?: string;
    username: string;
    email: string;
    password: string;
    name: string;
    age: number;
    phone: string;
    profilePicture?: string;  // Agregar aquí
    role?: string;
    reset_token?: string | null; 
    reset_token_expires?: Date | null;
  }

class User {
    // Buscar usuario por nombre de usuario
    static async findByUsername(username: string): Promise<User[]> {
      let query = `SELECT * FROM users WHERE username = ?`;
      const [rows] = await pool.query(query, [username]);
      return rows as User[];
    }
  
    // Buscar usuario por email
    static async findByEmail(email: string): Promise<User[]> {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows as User[];
    }
  
  // Buscar usuario por ID
  static async findById(id: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    // Asegúrate de que rows sea un arreglo antes de acceder a su longitud
    if (!Array.isArray(rows) || rows.length === 0) {
      return null; // Si no hay resultados, devolvemos null
    }
  
    // Devuelves el primer usuario encontrado
    return rows[0] as User;
  }
  
    // Crear un nuevo usuario
    static async create(user: User): Promise<void> {
      const query = 'INSERT INTO users (username, email, name, age, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [user.username, user.email, user.name, user.age, user.phone, user.password, user.role];
      await pool.query(query, values);
    }
  
    
    // Actualizar usuario
    static async update(id: string, user: Partial<User>): Promise<void> {
      const query = 'UPDATE users SET username = ?, email = ?, name = ?, age = ?, phone = ?, password = ?, profilePicture = ? WHERE id = ?';
      const values = [
        user.username,
        user.email,
        user.name,
        user.age,
        user.phone,
        user.password,
        user.profilePicture,  // Asegúrate de agregar profilePicture aquí
        id
      ];
      await pool.query(query, values);
    }
  
    // Cambiar la contraseña de un usuario
    static async changePassword(id: string, newPassword: string): Promise<void> {
      const query = 'UPDATE users SET password = ? WHERE id = ?';
      const values = [newPassword, id];
      await pool.query(query, values);
    }
  
    static async updateResetToken(email: string, code: string | null, expires: Date | null): Promise<void> {
      await pool.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [code, expires, email]
      );
    }
    
  }
  
  export default User;

