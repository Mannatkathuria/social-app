import { upload } from "../middlewares/multer.middleware.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";


const addPost = asyncHandler(async (req, res) => {

    const { user, description } = req.body;

    if (!req.file) {
        throw new ApiError(400, "File not uploaded");
    }

    const cloudFile = await uploadOnCloudinary(
        req.file.path
    );

    const owner = await User.findOne({
        username: user
    });


    const post = await Post.create({
        owner: owner._id,
        file: cloudFile.secure_url,
        description
    });

    try {
        owner.posts.push(post._id);
        await owner.save();
        console.log("saved successfully");
    }
    catch(err) {
        console.log(err);
    }

    res.status(201).json(
        new ApiResponse(
            201,
            post,
            "Post created"
        )
    );
});

const getPosts = asyncHandler(async (req, res) => {
    const { user } = req.query;

    const owner = await User.findOne({
    username: user
    }).populate({
        path: "posts",
        options: { sort: { createdAt: -1 } }
    });

    if (!owner) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            owner.posts
        )
    );
});

const getOnePost = asyncHandler(async (req, res) => {
    const {post_id} = req.query

    const post = await Post.findById(post_id).populate("owner", "username")

    if(!post) throw new ApiError(404, "No post found")
    else res.status(200).json(post)

})

const likePost = asyncHandler(async (req, res) => {
    const { post_id, user } = req.body;

    const post = await Post.findById(post_id);

    const foundUser = await User.findOne({
        username: user
    });

    if (!post || !foundUser) {
        throw new ApiError(404, "User or Post not found");
    }

    const liked = post.likes.some(
        id => id.toString() === foundUser._id.toString()
    );

    if (liked) {
        post.likes.pull(foundUser._id);
    } else {
        post.likes.push(foundUser._id);
    }

    await post.save();

    res.status(200).json(
        new ApiResponse(
            200,
            {
                liked: !liked,
                likesCount: post.likes.length
            }
        )
    );
});

const commentPosts = asyncHandler(async (req, res) => {
    const { post_id, user, text } = req.body;

    const post = await Post.findById(post_id);

    const foundUser = await User.findOne({
        username: user
    });

    if (!post || !foundUser) {
        throw new ApiError(404, "User or Post not found");
    }

    post.comments.push({
        user: foundUser._id,
        text
    });

    await post.save();

    // Populate the user field for the new comment
    const updatedPost = await Post.findById(post_id)
        .populate("comments.user", "username");

    res.status(200).json(
        new ApiResponse(
            200,
            updatedPost.comments,
            "Comment added"
        )
    );
});

const getFeed = asyncHandler(async (req, res) => {
    const { username } = req.query;

    const currentUser = await User.findOne({
        username
    });

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    const posts = await Post.find({
        owner: {
            $in: [
                ...currentUser.following,
                currentUser._id
            ]
        }
    })
        .populate("owner", "username pfp")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, posts)
    );
});

const deletePost = asyncHandler(async (req, res) => {
    const { post_id, username } = req.body;

    const post = await Post.findById(post_id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const owner = await User.findOne({ username });
    if (!owner) {
        throw new ApiError(404, "User not found");
    }

    // Check if the user is the owner
    if (post.owner.toString() !== owner._id.toString()) {
        throw new ApiError(403, "You can only delete your own posts");
    }

    // Remove post reference from user
    owner.posts.pull(post._id);
    await owner.save();

    // Delete the post
    await Post.findByIdAndDelete(post_id);

    res.status(200).json(
        new ApiResponse(200, null, "Post deleted successfully")
    );
});

export { addPost, getPosts, getOnePost, likePost, commentPosts, getFeed, deletePost }