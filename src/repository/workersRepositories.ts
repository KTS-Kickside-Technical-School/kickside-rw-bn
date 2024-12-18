import User from "../database/models/user";

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
    return await User.findOne({where: { email }});
}

