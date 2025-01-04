import { Response } from "express";
import { comparePassword, generateToken } from "../helpers/authHelpers";
import authRepositories from "../repository/authRepositories";
import { sendEmail } from "../service/emailService";
import user from "../database/models/user";
import jwt from 'jsonwebtoken'
import User from "../database/models/user";

const userLogin = async (req: any, res: Response): Promise<any> => {
    try {
        const isPasswordMatch = await comparePassword(req.body.password, req.user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Email or Password is not correct.",
            })
        }
        if (req.user.isDisabled === true) {
            return res.status(401).json({
                status: 401,
                message: "Your account has been disabled. Please contact the administrator."
            })
        }
        
        const token = await generateToken(req.user._id);
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
};

export const forgotPassword = async(req: any, res: Response): Promise<any> =>{
    try {
        const {email}= req.body
        const user = await User.findOne({ email });

        const resetToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const reseLink = `https://www.kickside.rw/reset-password?token=${resetToken}`
        await sendEmail(email, "Password reset request", 'Password Reset Process',
            `<p>Click <a href="${reseLink}">here</a> to reset your password. This link expires in 1 hour.</p>
            If you have any questions or require assistance, feel free to reach out.
            <br/>
            Best regards,
            <br/>
            Kickside Rwanda Team
            </p>`
        )
        return res.status(200).json({
            status: 200,
            message: "Password reset email sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.messsage
        })
        
    }
};

export default {
    userLogin,
    forgotPassword
}