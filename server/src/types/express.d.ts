

// src/types/express.d.ts
import { AuthUser } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser; // Usamos solo las propiedades necesarias
    }
  }
}



interface JwtPayload {
    id: string; 
    username: string;
    email: string;
    // Puedes agregar más campos si es necesario, según  el JWT
  }
