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
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User;