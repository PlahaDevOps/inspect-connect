import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        error: 'Access denied. No token provided.'
      });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    let user;
    if(decoded){
     user =  await userModel.findOne({
      _id: decoded?.id,
      isDeleted: false,
     });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token.'
    });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied. Admin privileges required.'
      });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({
      error: 'Access denied.'
    });
  }
};