import subcibersMailing from "../database/models/subscribersList";

export const saveSubscibers = async(data: any)=>{
    return await subcibersMailing.create(data)
}
export const findSubscriberByEmail = async(email)=>{
    return await subcibersMailing.findOne({email})
};

export const unsubscriber = async(email) =>{
    return await subcibersMailing.findOneAndDelete({email})
}

export default {
    saveSubscibers,
    findSubscriberByEmail,
    unsubscriber
}