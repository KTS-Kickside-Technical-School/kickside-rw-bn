import { NextFunction, Response } from "express";
import authRepositories from "../repository/authRepositories"

export const isUserExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = await authRepositories.findUserByAttribute("email", req.body.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        console.error("Error checking user existences", error);
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

export const isUserExistsById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id = req.body._id || req.params.userId
        const user = await authRepositories.findUserByAttribute("_id", id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        console.error("Error checking user existences", error);
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
};

export const isInformationChanged = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user._id
        const existingUser = await authRepositories.getUserById(userId);

        const updates= req.body
        const updatedKeys = Object.keys(updates)
        const hasChanged = updatedKeys.some(Key=> updates[Key] !== existingUser[Key])
        if(!hasChanged){
            return res.status(400).json({
                status: 400,
                message: "No change detected",
                data: {
                    existingUser
                }
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