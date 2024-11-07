import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

export const generateToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const decodeToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}