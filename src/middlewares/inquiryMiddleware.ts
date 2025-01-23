import inquiryRepository from "../repository/inquiryRepository";

export const checkInquiryExist = async(req, res, next) =>{
    const {id} = req.params;
    const inquiry = await inquiryRepository.findInquiryById(id);
    if(!inquiry){
        return res.staus(404).json({
            status: 404,
            message: "Inquiry Not Found"
        })
    };
    req.inquiry = inquiry
    next();
};

export default {
    checkInquiryExist
}