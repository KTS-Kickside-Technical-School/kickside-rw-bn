import { number } from "joi";
import workersRepositories from "../repository/workersRepositories";
import { Response, request, NextFunction } from "express";
import path from "path";


export const isWorkerExist = async(req: any, res: Response, next: NextFunction): Promise<any> =>{
    try {
        const worker = await workersRepositories.findAllWorkers();
        if(!worker.length){
            return res.status(404).json({
                status: 404,
                message: "Worker Not Found"
            })

        }
        req.worker=worker;
        return next()
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
        
        
    }
}

export const perseQueryParams = async(req: any, res: Response, next: NextFunction) =>{
    try {

        req.query.page = parseInt(req.query.page as string) || 1;
        req.query.limit = parseInt(req.query.limit as string ) || 10;
        req.query.skip = ((req.query.page as number) -1) * (req.query.limit as number)
        req.query.sort = req.query.sort || 'createdAt'
        req.query.filter = req.query.filter? JSON.parse(req.query.filter as string ): {}
        next()
        
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Invalid Query Parameter"
        })
        
    }

};

export const validateResetRequest = (req: any, res: Response, next: NextFunction): any => {
    const { email, token, newPassword } = req.body;

    if (req.path === "/request-reset") {
        if (!email) {
            return res.status(400).json({ 
                status: 400, 
                message: "Email is required" 
            });
        }
    }

    if (req.path === "/reset-password") {
        if (!token || !newPassword) {
            return res.status(400).json({ 
                status: 400, 
                message: "Token and new password are required" 
            });
        }
    }

    next(); 
};

export default{
    isWorkerExist,
    validateResetRequest
}