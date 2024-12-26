import User from "../database/models/user";

const findWorkerByAttribute = async (key: any, value: any) => {
    return User.findOne({ [key]: value })
}

const createUser = async (userData: any) => {
    return await User.create(userData);
}

const findAllWorkers = async (filter: object = {}, sort: string = 'createdAt', skip: number = 0, limit: number = 10) => {
    const worker = User.find(filter, '-password').sort(sort).skip(skip).limit(limit);
    return worker;

}

const updateUser = async (id: any, data: any) => {
    return await User.findByIdAndUpdate(id, data, { new: true })
}

export default {
    findWorkerByAttribute,
    createUser,
    findAllWorkers,
    updateUser
}