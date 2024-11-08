import Session from "../database/models/session"
import User from "../database/models/user"

const findUserByAttribute = async (key: any, value: String) => {
    return User.findOne({ [key]: value })
}

const saveSession = async (data: any) => {
    return Session.create(data);
}

const findSessionByUserIdAndToken = async (user, content) => {
    return Session.findOne({ user, content })
}

export default {
    findUserByAttribute,
    saveSession,
    findSessionByUserIdAndToken
}