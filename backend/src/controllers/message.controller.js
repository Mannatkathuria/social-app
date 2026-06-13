import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
    const { targetUser } = req.params;
    const { user } = req.query;

    const messages = await Message.find({
        $or: [
            {
                sender: user,
                receiver: targetUser
            },
            {
                sender: targetUser,
                receiver: user
            }
        ]
    }).sort({ createdAt: 1 });

    await Message.updateMany(
        {
            sender: targetUser,
            receiver: user,
            seen: false
        },
        {
            $set: { seen: true }
        }
    );

    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched")
    );
});

const sendMessage = asyncHandler(async (req, res) => {
    const { targetUser } = req.params;
    const { sender, text } = req.body;

    if (!sender || !text) {
        return res.status(400).json(
            new ApiResponse(400, null, "Missing sender or text")
        );
    }

    const msg = await Message.create({
        sender,
        receiver: targetUser,
        text
    });

    return res.status(201).json(
        new ApiResponse(201, msg, "Message sent")
    );
});

const getChats = asyncHandler( async (req, res) => {
    const { user } = req.params

    const users = new Set()

    const messages = await Message.find({
        $or: [{sender: user}, {receiver: user}]
    }).sort({ createdAt: -1 });

    messages.forEach(msg => {
        if (msg.sender === user) {
            users.add(msg.receiver);
        } else {
            users.add(msg.sender);
        }
    });

    res.status(200).json(new ApiResponse(200, Array.from(users)))
})

export { getMessages, sendMessage, getChats };