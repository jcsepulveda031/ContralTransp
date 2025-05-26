export interface JwtPayload {
    id: string;
    role: string;
    exp?: number;
    iat?: number;
    // No incluyas propiedades sensibles o innecesarias aquí
  }