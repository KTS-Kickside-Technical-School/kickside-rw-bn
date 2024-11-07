import { Response } from "express";
import { comparePassword, generateToken } from "../helpers/authHelpers";

const userLogin = async (req: any, res: Response): Promise<any> => {
    try {
        const isPasswordMatch = await comparePassword(req.body.password, req.user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Incorrect password",
            })
        }
        const token = generateToken(req.user._id);
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            token,
            user: req.user
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        })
    }
}

export default {
    userLogin
}