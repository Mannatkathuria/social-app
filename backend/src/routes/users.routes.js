import { Router } from "express";
import { loginUser, registerUser, getUserProfile, toggleFollowUser, getAttachments } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { getChats, getMessages, sendMessage } from "../controllers/message.controller.js";
import { addPost, commentPosts, getFeed, getOnePost, getPosts, likePost } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/follow/:username").post(toggleFollowUser);
router.route("/attachments").get(getAttachments);

router.route("/feed").get(getFeed)
router.route("/post").get(getPosts)
router.route("/post/add").post(upload.single("image"), addPost)
router.route("/post/like").post(likePost)
router.route("/post/comment").post(commentPosts)
router.route("/post/get").get(getOnePost)

router.route("/chatbox/:targetUser").get(getMessages)
router.route("/chatbox/:targetUser").post(sendMessage)
router.route("/chats/:user").get(getChats)
router.route("/:username").get(getUserProfile);

export default router