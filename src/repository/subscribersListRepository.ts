import SubscriberList from "../database/models/subscribersList";

export const saveSubscibers = async(data: any)=>{
    return await SubscriberList.create(data)
}
export const findSubscriberByEmail = async(email)=>{
    return await SubscriberList.findOne({email})
};

export const unsubscriber = async(email) =>{
    return await SubscriberList.findOneAndDelete({email})
}

export default {
    saveSubscibers,
    findSubscriberByEmail,
    unsubscriber
}