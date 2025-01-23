import Inquiry from "../database/models/inquiry";

const saveArticleInquiry = async(data: any) =>{
    return await Inquiry.create(data)
}

const getAllInquiries = async() =>{
    return await Inquiry.find().sort({createdAt: -1})
}

const updateInquiryStatus = async(_id, status) =>{
    return await Inquiry.findByIdAndUpdate(_id, {status: status}, {new: true})
}

const findInquiryById = async(id) =>{
    return await Inquiry.findById(id)
}

export default {
    saveArticleInquiry,
    getAllInquiries,
    updateInquiryStatus,
    findInquiryById
}