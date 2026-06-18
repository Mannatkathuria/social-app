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
    const [ownerPfp, setOwnerPfp] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [liked, setLiked] = useState(false);
    const [commentText, setCommentText] = useState(""); 
    const [deleted, setDeleted] = useState(false);

    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const timeAgo = (date) => {
        if (!date) return "";
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    useEffect(() => {
        loadPost()
    }, [post_id])

    const loadPost = async () => {
        try{
            const post = await api.get(`/users/post/get`, {params: {post_id}})
            const res = post.data.data || post.data

            setLikes(res.likes || [])
            setDesc(res.description || "")
            setImg(res.file)
            setComments(res.comments || [])
            setOwner(res.owner?.username)
            setOwnerPfp(res.owner?.pfp || "")

            setLiked(
                (res.likes || []).some(
                    id => id === user || id.username === user || id._id === user
                )
            );
        } catch(err){
            setErrMsg(err.response?.data?.data || err.response?.data || "Network error")
            console.log(err)
        }
    }

    const handleLike = async () => {
        try {
            const res = await api.post("/users/post/like", { post_id, user });
            setLiked(res.data.data.liked);
            if (res.data.data.liked) {
                setLikes(prev => [...prev, { _id: user }]);
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
            const res = await api.post("/users/post/comment", { post_id, user, text: commentText });
            const updatedPost = await api.get("/users/post/get", { params: { post_id } });
            setComments(updatedPost.data.data?.comments || res.data.data || []);
            setCommentText("");
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post forever?")) return;
        try {
            await api.post("/users/post/delete", { post_id, username: user });
            setDeleted(true);
            setTimeout(() => navigate(`/${user}`), 500);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    if (deleted) {
        return (
            <div className="loading-page" style={{ flexDirection: 'column', gap: 12 }}>
                <p>Post deleted</p>
                <button className="ig-btn ig-btn-primary" onClick={() => navigate(`/${user}`)}>
                    Go to Profile
                </button>
            </div>
        );
    }

    return (
        <div className="single-post-page">
            <div className="single-post">
                <div className="single-post-image">
                    {img && <img src={img} alt="post" />}
                </div>

                <div className="single-post-side">
                    <div className="single-post-side-header">
                        <div className="single-post-side-user">
                            {ownerPfp ? (
                                <img src={ownerPfp} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
                                    {owner?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/${owner}`)}>
                                {owner}
                            </strong>
                        </div>
                        {user === owner && (
                            <button className="post-delete-btn" onClick={handleDelete}>
                                Delete
                            </button>
                        )}
                    </div>

                    <div className="single-post-comments">
                        {desc && (
                            <div className="single-post-comment">
                                <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/${owner}`)}>
                                    {owner}
                                </strong>
                                {' '}{desc}
                            </div>
                        )}

                        {comments.length === 0 && !desc && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No comments yet</p>
                        )}

                        {comments.map((comment, index) => (
                            <div key={comment._id || index} className="single-post-comment">
                                <strong
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/${comment.user?.username}`)}
                                >
                                    {comment.user?.username || "unknown"}
                                </strong>
                                {' '}{comment.text}
                            </div>
                        ))}
                    </div>

                    <div className="single-post-actions">
                        <div className="single-post-like-bar">
                            <button className="feed-action-btn" onClick={handleLike}>
                                {liked ? "❤️" : "🤍"}
                            </button>
                        </div>
                    </div>

                    <div className="single-post-likes">
                        {likes.length} likes
                    </div>

                    <div className="single-post-time">
                        {timeAgo(comments[0]?.createdAt)}
                    </div>

                    <div className="single-post-add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleComment();
                            }}
                        />
                        <button onClick={handleComment}>Post</button>
                    </div>
                </div>
            </div>

            <p className="error" style={{ marginTop: 12 }}> {errMsg} </p>
        </div>
    )
}

export default Post