import Session from "../database/models/session"
import User from "../database/models/user"

const findUserByAttribute = async (key: any, value: String) => {
    return await User.findOne({ [key]: value }).select("+password")
}

const saveSession = async (data: any) => {
    return await Session.create(data);
}

const findSessionByUserIdAndToken = async (user: any, content: any) => {
    return await Session.findOne({ user, content })
}

export const updateUser = async(userId: string, updateData: any) =>{
    return await User.findByIdAndUpdate(userId, updateData, {new: true})


}

export default {
    findUserByAttribute,
    saveSession,
    findSessionByUserIdAndToken,
    updateUser
}