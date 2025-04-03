import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("token-------",token)
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
   // Ensure your JWT_SECRET matches exactly what was used to create the token
    console.log("Secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    console.log("data",decoded.userId)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};