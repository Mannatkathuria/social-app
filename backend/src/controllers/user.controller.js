import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req, res) => {
    // get details from user
    // validation - non-empty, already-exists etc
    // check for images and avtar
    // upload on cloudinary
    // create user object
    // create entry in db
    // remove password and refresh token field from res
    // check for user creation
    // return res

    const {username, password} = req.body

    if(
        [password, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({username})

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        password,
        username
    })


    const createdUser = await User.findById(user._id).select( "-password -refreshToken" )

    if(!createdUser){
        throw new ApiError(500, "couldn't register user")
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "user registered successfully"))

})

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})

    if(!user) throw new ApiError(404, "User doesn't exist")
    
    const validPassword = await user.isPasswordCorrect(password)

    if(!validPassword) throw new ApiError(401, "Invalid Credentials")
    return res.status(200).json(new ApiResponse(200, user, "logged in"))
})

const getUserProfile = asyncHandler(async (req, res) => {
    const {username} = req.params

    const user = await User.findOne({username}).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User doesn't exist")

    return res.status(200).json(new ApiResponse(203, user, "found"))
})

const toggleFollowUser = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    const {currentUsername} = req.body; 

    if (!currentUsername) {
        throw new ApiError(401, "Unauthorized: Please log in to follow users");
    };

    const currentLoggedInUser = await User.findOne({ username: currentUsername });
    const targetUser = await User.findOne({ username });

    if (!targetUser || !currentLoggedInUser) {
        throw new ApiError(404, "User files not found");
    }

    const currentUserId = currentLoggedInUser._id;
    const isFollowing = targetUser.followers.includes(currentUserId);

    if (isFollowing) {
        await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUser._id } });
        return res.status(200).json(new ApiResponse(200, { isFollowing: false }, "Unfollowed"));
    } 
    else {
        await User.findByIdAndUpdate(targetUser._id, { $push: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $push: { following: targetUser._id } });
        return res.status(200).json(new ApiResponse(200, { isFollowing: true }, "Followed"));
    }

})

const getAttachments = asyncHandler(async (req, res) => {
    const { user } = req.query;

    const userDoc = await User.findOne({ username: user })
        .populate("followers", "username")
        .populate("following", "username");

    if (!userDoc) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, {
            followers: userDoc.followers,
            following: userDoc.following
        })
    );
});

export { registerUser, loginUser, getUserProfile, toggleFollowUser, getAttachments }