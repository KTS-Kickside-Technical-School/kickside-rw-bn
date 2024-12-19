import { Response } from "express";
import { comparePassword, generateToken } from "../helpers/authHelpers";
import authRepositories from "../repository/authRepositories";
import mongoose from "mongoose";
import { lookupLocation } from "../utils/geoService";
import { sendEmail } from "../../service/emailService";

const userLogin = async (req: any, res: Response): Promise<any> => {

    try {
        const isPasswordMatch = await comparePassword(req.body.password, req.user.password);
        if (!req.body.password || !req.user.password) {
            return res.status(400).json({
                status: 400,
                message: "Password is required"
            })
        };

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Incorrect password",
            })
        }
        const token = generateToken(req.user._id);
        const session = await authRepositories.saveSession({
            user: new mongoose.Types.ObjectId(req.user._id),
            content: token
        });

        const userAgent = req.headers["user-agent"] || "Unknown Devices";
        const ip = req.ip || req.connection.remoteAddress;
        const location = lookupLocation(ip)

        await sendEmail(req.user.email, userAgent, location);


        return res.status(200).json({
            status: 200,
            message: "Login successful",
            user: req.user,
            session
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