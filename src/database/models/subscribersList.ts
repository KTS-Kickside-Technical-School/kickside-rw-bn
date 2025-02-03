import mongoose, { Schema } from "mongoose";

const subscribersListSchema = new Schema ({
    email: {
        type: String,
        required: true
    }
},{timestamps: true})

const subcibersMailing = mongoose.model('subcibersMailing', subscribersListSchema)

export default subcibersMailing