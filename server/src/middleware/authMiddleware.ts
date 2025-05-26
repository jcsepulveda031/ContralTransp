import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { AuthUser } from '../types/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      message: 'Acceso no autorizado',
      code: 'UNAUTHORIZED' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Agregamos información del usuario al request
    const authUser: AuthUser = {
      id: decoded.id,
      role: decoded.role
    };
    
    req.user = authUser;
    // Opcional: puedes agregar el tiempo restante del token al response
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp) {
      const expiresIn = decoded.exp - now;
      res.setHeader('X-Token-Expires-In', expiresIn.toString());
    }
    
    next();
  } catch (error: any) {
    let message = 'Token no válido';
    let code = 'INVALID_TOKEN';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Token expirado';
      code = 'TOKEN_EXPIRED';
    }
    
    res.status(401).json({ 
      message,
      code 
    });
  }
};