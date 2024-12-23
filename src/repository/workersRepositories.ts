import User from "../database/models/user";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const findWorkerByAttribute = async (key: any, value: any) => {
    return User.findOne({ [key]: value })
}

const createUser = async (userData: any) => {
    return await User.create(userData);
}

const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
}

const findAllWorkers = async (filter: object = {}, sort: string = 'createdAt', skip: number = 0, limit: number = 10) => {
    const worker = User.find(filter, '-password').sort(sort).skip(skip).limit(limit);
    return worker;

}

const countUser = async (filter: object = {}) => {
    return User.countDocuments(filter)
}

const disableUserById = async (_id: string, reason: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null;
    }
    return User.findByIdAndUpdate(
        _id,
        { isDisabled: true, disableReason: reason },
        { new: true }
    );
};

const enableUserById = async (_id: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null;
    }
    return User.findByIdAndUpdate(
        _id,
        { isDisabled: false, disableReason: null },
        { new: true }
    );
};


const deleteUserById = async (_id: string) => {
    return User.findByIdAndDelete(_id)
}

const updateUserDetails = async (_id: string, updates: any) => {
    return User.findByIdAndUpdate(_id, updates, { new: true })
};

const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
};

const saveResetPassword = async (email: string, token: string): Promise<void> => {
    const expireAt = new Date(Date.now() + 3600000)
    await User.findOneAndUpdate(
        { email },
        { resetPaaswordToken: token, resetPasswordExpires: expireAt },
        { new: true }
    );
};


const updatePassword = async (_id: string, newPassword: string): Promise<void> => {
    const hashedPasswordReset = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
        _id,
        {
            password: hashedPasswordReset,
            resetPaaswordToken: null,
            resetPasswordExpires: null,
        },
        {
            new: true
        }
    );
};

const findUserById = async (_id: string) => {
    return await User.findById(_id);
};

const updateUserRole = async (_id: string, role: string) => {
    const user = await User.findById(_id);
    if (user) {
        user.role = role;
        await user.save();
    }
    return user;
};

export default {
    findWorkerByAttribute,
    createUser,
    findUserByEmail,
    findAllWorkers,
    countUser,
    enableUserById,
    deleteUserById,
    updateUserDetails,
    generateResetToken,
    saveResetPassword,
    updatePassword,
    updateUserRole,
    findUserById
}