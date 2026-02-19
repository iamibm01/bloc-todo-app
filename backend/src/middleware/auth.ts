import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Extend Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    // 2. Check if token exists
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // 3. Verify token signature
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string
    };

    // 4. Attach userId to request object
    req.userId = decoded.userId;

    // 5. Continue to next middleware/route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
