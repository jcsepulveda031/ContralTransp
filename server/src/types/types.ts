
export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  name: string;
  age: number;
  phone: string;
  profilePicture?: string;  // Agregar aquí
  role?: string;
  resetToken?: string | null; 
  resetTokenExpires?: Date | null;
}
export interface AuthUser {
  id: string;
  role: string;
  // Solo incluye las propiedades necesarias para el contexto de autenticación
}