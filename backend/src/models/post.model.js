import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema({

    file: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema)