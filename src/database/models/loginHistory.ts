import { time, timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const loginHistorySchema = new Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    device:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    logged_in_at: {
        type: String,
        required: true,
        date: Date.now,
        time: time
    },
    is_notified:{
        type: Boolean(false),
        required: true
    }
},{timestamps: true})

const loginHistory = mongoose.model('loginHistory', loginHistorySchema)

export default loginHistory