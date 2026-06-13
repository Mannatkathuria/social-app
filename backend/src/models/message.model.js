import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({

        sender: {
            type: String,
            required: true
        },

        receiver: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        seen: {
            type: Boolean,
            default: false
        }

    },{ timestamps: true });

export const Message = mongoose.model("Message", messageSchema);