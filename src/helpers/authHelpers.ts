import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

export const generateToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const decodeToken = (token: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return jwt.verify(token, secret);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}