import jwt, {JwtPayload} from 'jsonwebtoken'
import { Response, Request, NextFunction, RequestHandler } from 'express'

export interface AuntheticateRequest extends Request {
    user?: {
            email: string;
            role: string;
            JwtPayload
        };
        };

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({
            status: 401,
            message: "No token provided",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as AuntheticateRequest).user = decoded;
        next(); 
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: "Invalid Token or Expired Token",
        });
        return; 
    }
};


export const authorizeAdmin = (roles: string[]): RequestHandler => {
    return (req, res, next): void => {
        const user = (req as AuntheticateRequest).user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({
                status: 403,
                message: "Access Denied",
            });
            return; 
        }
        next(); 
    };
};


