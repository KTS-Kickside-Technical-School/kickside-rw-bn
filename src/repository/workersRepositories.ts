import User from "../database/models/user";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { token } from "morgan";

export const createUser = async(userData:{
    firstName: string, 
    lastName: string, 
    email: string, 
    role: object, 
    password: string
}) =>{
    const newUser = await User.create(userData);
    return newUser;
}

export const findUserByEmail = async(email:string) =>{
    return await User.findOne({ email });
}

export const findAllWorkers = async(filter: object={}, sort: string= 'createdAt', skip: number = 0, limit:number = 10 )=>{
    const worker = User.find(filter, '-password').sort(sort).skip(skip).limit(limit);
    return worker;

}

export const countUser = async(filter: object = {}) =>{
    return User.countDocuments(filter)
}

export const disableUserById = async (_id: string, reason: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null; 
    }
    return User.findByIdAndUpdate(
        _id,
        { isDisabled: true, disableReason: reason },
        { new: true }
    );
};

export const enableUserById = async (_id: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null; 
    }
    return User.findByIdAndUpdate(
        _id,
        { isDisabled: false, disableReason: null },
        { new: true }
    );
};


export const deleteUserById = async (_id: string) =>{
    return User.findByIdAndDelete(_id)
}


export const updateUserDetails = async(_id: string, updates: any) =>{
    return User.findByIdAndUpdate(_id, updates, {new: true})
};

export const generateResetToken = (): string =>{
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
};

export const saveResetPassword = async(email: string, token: string): Promise<void> =>{
    const expireAt = new Date(Date.now()+3600000)
    await User.findOneAndUpdate(
        { email },
        { resetPaaswordToken: token, resetPasswordExpires: expireAt },
        { new:true }
    );
};

export const validateToken = async(token: string): Promise<any> =>{
    const user =  await User.findOne({
        resetPaaswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    });
    return user;
};

export const updatePassword = async(_id: string, newPassword: string): Promise <void> =>{
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

export const findUserById = async (_id: string) => {
    return await User.findById(_id);
};

export const updateUserRole = async (_id: string, role: string) => {
    const user = await User.findById(_id);
    if (user) {
        user.role = role;
        await user.save();
    }
    return user;
};

export default{
    createUser,
    findUserByEmail,
    findAllWorkers,
    countUser,
    enableUserById,
    deleteUserById,
    updateUserDetails,
    generateResetToken,
    saveResetPassword,
    validateToken,
    updatePassword,
    updateUserRole,
    findUserById
}