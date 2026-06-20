import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if ([password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        password,
        username
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "couldn't register user")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: createdUser,
            accessToken,
            refreshToken
        }, "user registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) throw new ApiError(401, "User doesn't exist")
    
    const validPassword = await user.isPasswordCorrect(password)

    if (!validPassword) throw new ApiError(401, "Invalid Credentials")

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "logged in"))
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })
        .select("-password -refreshToken")
        .populate("followers", "username pfp")
        .populate("following", "username pfp")

    if (!user) throw new ApiError(404, "User doesn't exist")

    return res.status(200).json(new ApiResponse(203, user, "found"))
})

const toggleFollowUser = asyncHandler(async (req, res) => {
    const { username } = req.params; 
    const { currentUsername } = req.body; 

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
        .populate("followers", "username pfp")
        .populate("following", "username pfp");

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

const updateProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { fullName, bio, email } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (email !== undefined) updateData.email = email;

    // Handle profile picture upload (CloudinaryStorage returns URL in req.file.path)
    if (req.file) {
        updateData.pfp = req.file.path;
    }

    const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});

const searchUsers = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(200).json(new ApiResponse(200, [], "No search query"));
    }

    const users = await User.find({
        username: { $regex: q, $options: "i" }
    })
        .select("username pfp fullName")
        .limit(20);

    res.status(200).json(new ApiResponse(200, users, "Users found"));
});

export { registerUser, loginUser, getUserProfile, toggleFollowUser, getAttachments, updateProfile, searchUsers }