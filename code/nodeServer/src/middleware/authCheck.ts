import express, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Middleware for Token Verification
const authenticateToken = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_ACCESS_SECRET!
        ) as { id: string, email: string, role: string };

        // Attach user to request
        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export default authenticateToken;