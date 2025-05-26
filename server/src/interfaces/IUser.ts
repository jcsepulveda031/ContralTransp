
import {  RowDataPacket } from 'mysql2/promise';
export interface IUser {
    id: number;
    username: string;
    email: string;
    name: string;
    age?: number;
    phone?: string;
    profile_picture?: string;
  }
  
  export interface IUserAuth {
    username: string;
    email: string;
    password: string;
    name: string;
  }
  
  
  export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface IUserManagement {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    age?: number | null;
    phone?: string | null;
    profile_picture?: string | null;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface IUserUpdate {
    email: string;
    name: string;
    age?: number | null;
    phone?: string | null;
  }
  export interface Conductor extends RowDataPacket{
    cedula: string;
    nombre: string;
    telefono: string;
    direccion: string;
    email: string;
    licencia: string;
    username:string;
  }

  export interface UserTableInfo extends RowDataPacket{
    id: number;
    username:string;
    email:string;
    name: string;
    age: number;
    phone: number;
    role:string;
  }
  
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
