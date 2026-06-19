import { Router } from "express";
import { loginUser, registerUser, getUserProfile, toggleFollowUser, getAttachments, updateProfile, searchUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { getChats, getMessages, sendMessage } from "../controllers/message.controller.js";
import { addPost, commentPosts, deletePost, getFeed, getOnePost, getPosts, likePost } from "../controllers/post.controller.js";
import { upload } from "../utils/multer-cloudinary.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/follow/:username").post(toggleFollowUser);
router.route("/attachments").get(getAttachments);
router.route("/search").get(searchUsers);

router.route("/feed").get(getFeed)
router.route("/post").get(getPosts)
router.route("/post/add").post(upload.single("image"), addPost)
router.route("/post/like").post(likePost)
router.route("/post/comment").post(commentPosts)
router.route("/post/get").get(getOnePost)
router.route("/post/delete").post(deletePost)

router.route("/profile/:username").put(upload.single("pfp"), updateProfile)

router.route("/chatbox/:targetUser").get(getMessages)
router.route("/chatbox/:targetUser").post(sendMessage)
router.route("/chats/:user").get(getChats)
router.route("/:username").get(getUserProfile);

export default router