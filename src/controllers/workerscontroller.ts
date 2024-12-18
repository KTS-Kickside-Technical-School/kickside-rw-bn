import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../repository/workersRepositories';
import { sendEmail } from '../service/emailService';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { createUserSchema } from '../validations/workersValidations';

interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export const createUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const body: CreateUserRequest = req.body;
        const { error, value } = createUserSchema.validate(body); // Assuming `createUserSchema` is a Joi schema
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        const { firstName, lastName, email, role } = value;

        const existingUser = await findUserByEmail(body.email);
        if (existingUser) {
            res.status(400).json({
                status: 400,
                message: "User with this email already exists",
            });
            return;
        }

        const generatedPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const user = await createUser({ 
            firstName: body.firstName, 
            lastName: body.lastName, 
            email: body.email, 
            role: role, 
            password: hashedPassword });

        const isLogin = false;

        await sendEmail(req.user?.email, "", "", isLogin);
        res.status(201).json({
            status: 201,
            message: 'User created successfully, email sent.',
            user,
        });
    } catch (error) {
        console.error(error);
        next(error); 
    }
};

export default {
    createUserController,
};
