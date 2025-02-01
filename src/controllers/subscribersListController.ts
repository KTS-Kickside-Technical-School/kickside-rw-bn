import { Request, Response, NextFunction } from "express";
import { sendEmail } from "../service/emailService";
import subscribersListRepository from "../repository/subscribersListRepository";
import jwt from 'jsonwebtoken'


const saveSubscibersController = async(req: any, res: Response, next: NextFunction): Promise<any> =>{
    try {
        const {email} = req.body
        const subscriber = await subscribersListRepository.saveSubscibers({email});

        const token = jwt.sign({ 
            email: subscriber.email
        }, process.env.JWT_SECRET, { expiresIn: "1d"});

        const unsubscribeLink = `${process.env.CLIENT_URL}/subscribers-mail/unsubscriber?token=${token}`;

        await sendEmail( email, 
            "User Subscription", 
            "Subscription",
            `<p>${subscriber.email} You have been subscribed to our system. You will receive updates from us.</p>
            <p>Click here to <a href="${unsubscribeLink}">Unsubscribe</a></p>
            <br/>Best regards,<br/><b>Kickside Rwanda</b>`
      
        )
        res.status(201).json({
            status: 201,
            message: 'User subscriber successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
        
    }
};

const unsubscribeController = async(req: any, res: Response): Promise<any> =>{
    try {
        const {token} =req.body
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {email} = decoded
        let unsubscriber =  await subscribersListRepository.unsubscriber(email);
        unsubscriber = await subscribersListRepository.saveSubscibers({email}),
        await sendEmail( email, 
            "User unsubscribe", 
            "unsubscription",
            `<p>${unsubscriber.email} You have been unsubscribed to our system. You will no longer receive updates from us.</p>
            <p>Click here to <a href="">Subscribe again</a></p>
            <br/>Best regards,<br/><b>Kickside Rwanda</b>`
      
        )
        res.status(200).json({
            status: 200,
            message: "Unsubscribed successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
        
    }
}

export default {
    saveSubscibersController,
    unsubscribeController
}