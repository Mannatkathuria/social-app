import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Post(){
    const {id: post_id} = useParams()
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [img, setImg] = useState("")
    const [desc, setDesc] = useState("")
    const [owner, setOwner] = useState()
    const [errMsg, setErrMsg] = useState("")
    const [liked, setLiked] = useState(false);
    const [commentText, setCommentText] = useState(""); 
    const [showComments, setShowComments] = useState(false);

    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    useEffect(() => {
        const loadPost = async () => {
        try{
            const post = await api.get(`/users/post/get`, {params: {post_id}})

            const res = post.data.data || post.data

            setLikes(res.likes)
            setDesc(res.description)
            setImg(res.file)
            setComments(res.comments)
            setOwner(res.owner.username)

            setLiked(
                res.likes.some(
                    id => id === user || id.username === user
                )
            );

        } catch(err){
            setErrMsg(err.response?.data?.data || err.response?.data || "Network error")
            console.log(err)
        }
        }

        loadPost()

    }, [post_id])


    const handleLike = async () => {
        try {
            const res = await api.post(
                "/users/post/like",
                {
                    post_id,
                    user
                }
            );

            setLiked(res.data.data.liked);

            if (res.data.data.liked) {
                setLikes(prev => [...prev, user]);
            } else {
                setLikes(prev => prev.slice(0, -1));
            }

        } catch (err) {
            console.log(err);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;

        try {
            const res = await api.post(
                "/users/post/comment",
                {
                    post_id,
                    user,
                    text: commentText
                }
            );

            setComments(res.data.data);

            setCommentText("");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        <div className="flexbox border-2 border-s border-grey rounded-xl width-70">

            <strong className="p-5 cursor-pointer" onClick={() => navigate(`/${owner}`)}> {owner} </strong>

            <img src={img} className="mt-5 mb-2" />

            <p className="mb-3" > {desc} </p>

            <div className="flex">
                <button className="text-xl mb-4 mx-2" onClick={handleLike}>
                    {liked ? "❤️" : "🤍"} {likes.length}
                </button>

                <div className="text-xl mb-4 mx-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowComments(prev => !prev)}
                >
                    💬 {comments.length}
                </div>
            </div>

            {showComments && (
                <div
                    style={{
                        borderTop: "1px solid gray",
                        marginTop: "10px",
                        paddingTop: "10px"
                    }}
                >
                    {comments.length === 0 ? (
                        <p>No comments yet</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index}>
                                <strong>
                                    {comment.user?.username}
                                </strong>
                                {" "}
                                {comment.text}
                            </div>
                        ))
                    )}

                    <div style={{ marginTop: "10px" }}>
                        <input
                            value={commentText}
                            placeholder="Add a comment..."
                            onChange={(e) =>
                                setCommentText(e.target.value)
                            }
                        />

                        <button
                            onClick={handleComment}
                        >
                            Comment
                        </button>
                    </div>
                </div>
            )}


            <p className="error"> {errMsg} </p>
        </div>
        </>
    )
}

export default Post