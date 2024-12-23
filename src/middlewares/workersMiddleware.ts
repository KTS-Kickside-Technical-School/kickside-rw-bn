import workersRepositories from "../repository/workersRepositories";
import { Response, NextFunction } from "express";

export const isWorkerAlreadyExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        console.log("ijij")
        const worker = await workersRepositories.findWorkerByAttribute("email", req.body.email);       
       

        if (worker) {
            return res.status(400).json({
                status: 400,
                message: "Worker already exists"
            })
        }
        return next()
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}
export const isWorkersExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const workers = await workersRepositories.findAllWorkers();
        if (!workers.length) {
            return res.status(404).json({
                status: 404,
                message: "Worker Not Found"
            })

        }
        req.workers = workers;
        return next()
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })


    }
}

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