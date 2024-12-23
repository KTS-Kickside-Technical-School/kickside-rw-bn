import bcrypt from 'bcrypt';
import workersRepositories from '../repository/workersRepositories';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { createUserSchema } from '../validations/workersValidations';
import mongoose from 'mongoose';
import User from '../database/models/user';
import { decodeToken, generateToken, hashPassword } from '../helpers/authHelpers';


export const createUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const generatedPassword = await hashPassword("1234");
        req.body.password = generatedPassword
        const user = await workersRepositories.createUser(req.body);
        // await sendEmail(req, user.email,'creation',{});
        res.status(201).json({
            status: 201,
            message: 'Worker created successfully.',
            user,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};



export const getAllWorkers = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { filter, sort, skip, limit } = req.query as unknown as {
            filter: object;
            sort: string;
            skip: number;
            limit: number
        }
        const workers = await workersRepositories.findAllWorkers(filter, sort, skip, limit);
        const totalUser = await workersRepositories.countUser(filter)
        return res.status(201).json({
            status: 201,
            message: "User Retrieved Successfully",
            data: { workers },
            metaData: {
                totalUser,
                page: (req.query.page as number) || 1,
                limit,
                totalPages: Math.ceil(totalUser / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: error.message
        })
        next(error);

    }
};

export const disableUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;


        if (!reason) {
            return res.status(400).json({
                status: 400,
                message: "Disabling Reason Required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid User ID format",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User Not Found",
            });
        }

        user.isDisabled = true;
        user.disableReason = reason;

        await user.save();

        //   await sendEmail(req, user.email,'disable', {reason});

        return res.status(200).json({
            status: 200,
            message: "User Account Disabled Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const enableUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid User ID format",
            });
        };

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User Not Found'
            })
        };

        if (!user.isDisabled) {
            return res.status(400).json({
                status: 400,
                message: "User Is Already Active"
            })
        };

        user.isDisabled = false;
        user.disableReason = null;
        await user.save()

        //   await sendEmail(req, user.email, 'enable',{});

        return res.status(200).json({
            status: 200,
            message: "User Account Enabled Successfully"
        });



    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: error.message
        })

    }
}

export const deleteUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid User Id Format"
            })
        };

        const deletedWorker = await workersRepositories.deleteUserById(userId)
        if (!deletedWorker) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        };

        return res.status(200).json({
            status: 200,
            message: "User Deleted Successfully",
            data: { deletedWorker }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: error.message
        })

    }

};



export const updateUserController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params
        const { firstName, lastName, email } = req.body

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid UserId Format"
            })
        };

        if (req.body.password || req.body.role) {
            return res.status(400).json({
                status: 400,
                message: "Password and role can't be updated directly, on password please use password reset process"

            })
        };

        const updatedUser = await workersRepositories.updateUserDetails(userId, { firstName, lastName, email })
        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            })
        };

        return res.status(200).json({
            status: 200,
            mesage: "User Details Updated Successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: error.messsage
        })


    }
};



export const requestPasswordReset = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;
        const { userId } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid UserId Format"
            })
        };

        const user = await workersRepositories.findUserByEmail(email);
        console.log(`request email ${email}`);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        };

        const token = await generateToken(user._id);
        await workersRepositories.saveResetPassword(email, token);

        // await sendEmail(req, user.email,'reset',{token})
        return res.status(200).json({
            status: 200,
            message: " Reset email sent "
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.mesage
        });

    };
};



export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid UserId Format"
            })
        };

        const { token, newPassword } = req.body;

        const user = await decodeToken(token);
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid or Expired token"
            });
        };
        await workersRepositories.updatePassword(user._id, newPassword);
        return res.status(200).json({
            status: 200,
            message: "Password Reset Successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    };
};


export const updateUserRoleCotroller = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const user = await workersRepositories.findUserById(userId)
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        };

        const previousRole = user.role.toString();
        const updatedRole = await workersRepositories.updateUserRole(userId, role)
        const newRole = role.toString();


        // await sendEmail(req, user.email, 'change', {
        //     previousRole: previousRole,
        //     newRole: newRole

        // });
        return res.status(200).json({
            status: 200,
            message: "User Role Changed Successfully",
            data: { updatedRole }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    };
};

export default {
    createUserController,
    getAllWorkers,
    disableUserController,
    enableUserController,
    deleteUserController,
    updateUserController,
    requestPasswordReset,
    resetPassword,
    updateUserRoleCotroller


}