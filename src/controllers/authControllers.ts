import { Response } from "express";
import { comparePassword, generateToken } from "../helpers/authHelpers";
import authRepositories from "../repository/authRepositories";
import mongoose from "mongoose";
import { lookupLocation } from "../utils/geoService";
import { sendEmail } from "../service/emailService";
import user from "../database/models/user";

const userLogin = async (req: any, res: Response): Promise<any> => {

    try {
        const isPasswordMatch = await comparePassword(req.body.password, req.user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Email or Password is not correct.",
            })
        }
        const token = generateToken(req.user._id);
        const session = await authRepositories.saveSession({
            user: req.user._id,
            content: token
        });

        const device = req.headers["user-agent"] || "Unknown Devices";
        const ip = req.ip || req.connection.remoteAddress;

        await sendEmail(req.user.email, 'New Login Detected - Kickside Rw',
            'New Account Login',
            `<p>New login was detected to you account on <b>${device}</b> with this IP address: <b>${ip}</b>, if this was not you try reseting password.</p>`
        );


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