import { NextFunction, Response } from "express";
import authRepositories from "../repository/authRepositories";

export const isUserExistByUsername = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                status: 400,
                message: "Username is required."
            });
        }
        const user = await authRepositories.findUserByUsernames(username);

        if (!user) {
            return res.status(404).json({
                statu: 404,
                message: `Author with "${username}" Username is not found.`
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })

    }
}