import User from "../database/models/user"

const findUserByAttribute = async (key: any, value: String) => {
    return User.findOne({ [key]: value })
}

export default {
    findUserByAttribute
}