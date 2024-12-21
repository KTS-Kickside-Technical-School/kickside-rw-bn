import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Object,
        required: true
    },
    isDisabled:{
        type: Boolean,
        default: false,
        required: false
    },
    disableReason:{
        type: String,
        default: null,
        required: false
    },
    resetPaaswordToken:{
        type: String,
        default: null
    },
    resetPasswordExpires:{
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User;