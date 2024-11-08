import mongoose, { Schema } from "mongoose"

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'published'
    }
}, { timestamps: true })

const Article = mongoose.model('Article', articleSchema);

export default Article;