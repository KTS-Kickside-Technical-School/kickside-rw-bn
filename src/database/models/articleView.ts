import mongoose, { Schema } from "mongoose";

const articleViewchema = new Schema ({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    viewedAt:{
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const articleView  = mongoose.model("articleView", articleViewchema)

export default articleView