import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const { user, logged, userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");
    const [commentText, setCommentText] = useState({});

    useEffect(() => {
        if (!user || !logged) {
            setLoading(false);
            return;
        }
        loadFeed();
    }, [user, logged]);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users/feed", { params: { username: user } });
            setPosts(res.data.data || []);
        } catch (err) {
            setErrMsg(err.response?.data?.message || err.message || "Failed to load feed");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await api.post("/users/post/like", { post_id: postId, user });
            const liked = res.data.data.liked;
            setPosts(prev => prev.map(p =>
                p._id === postId
                    ? {
                        ...p,
                        likes: liked
                            ? [...p.likes, { _id: user }]
                            : p.likes.filter(l => l._id !== user && l !== user)
                    }
                    : p
            ));
        } catch (err) {
            console.log(err);
        }
    };

    const handleComment = async (postId) => {
        const text = commentText[postId]?.trim();
        if (!text) return;

        try {
            const res = await api.post("/users/post/comment", { post_id: postId, user, text });
            const updatedPost = await api.get("/users/post/get", { params: { post_id: postId } });
            const freshPost = updatedPost.data.data || updatedPost.data;

            setPosts(prev => prev.map(p =>
                p._id === postId ? { ...p, comments: freshPost.comments || res.data.data } : p
            ));
            setCommentText(prev => ({ ...prev, [postId]: "" }));
        } catch (err) {
            console.log(err);
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    if (!logged) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="feed-page">
            <div className="feed-main">
                {loading ? (
                    <div className="loading-page"><p>Loading feed...</p></div>
                ) : errMsg ? (
                    <div className="loading-page"><p>{errMsg}</p></div>
                ) : posts.length === 0 ? (
                    <div className="no-posts" style={{ marginTop: 40 }}>
                        <div className="no-posts-icon">📷</div>
                        <p>No posts in your feed yet</p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                            Follow users to see their posts here
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="feed-post">
                            <div className="feed-post-header">
                                <div className="feed-post-user" onClick={() => navigate(`/${post.owner?.username}`)}>
                                    {post.owner?.pfp ? (
                                        <img src={post.owner.pfp} alt="" className="feed-post-avatar" />
                                    ) : (
                                        <div className="feed-post-avatar-placeholder">
                                            {post.owner?.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="feed-post-username">{post.owner?.username}</span>
                                </div>
                            </div>

                            <img
                                src={post.file}
                                alt="post"
                                className="feed-post-image"
                                onClick={() => navigate(`/post/${post._id}`)}
                                style={{ cursor: 'pointer' }}
                            />

                            <div className="feed-post-actions">
                                <div className="feed-post-actions-left">
                                    <button className="feed-action-btn" onClick={() => handleLike(post._id)}>
                                        {post.likes?.some(l => l._id === user || l === user) ? "❤️" : "🤍"}
                                    </button>
                                    <button className="feed-action-btn" onClick={() => navigate(`/post/${post._id}`)}>
                                        💬
                                    </button>
                                </div>
                            </div>

                            <div className="feed-post-likes">
                                {post.likes?.length || 0} likes
                            </div>

                            <div className="feed-post-caption">
                                <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/${post.owner?.username}`)}>
                                    {post.owner?.username}
                                </strong>{' '}
                                {post.description}
                            </div>

                            {post.comments?.length > 0 && (
                                <div
                                    className="feed-post-comments-link"
                                    onClick={() => navigate(`/post/${post._id}`)}
                                >
                                    View all {post.comments.length} comments
                                </div>
                            )}

                            <div className="feed-post-time">
                                {timeAgo(post.createdAt)}
                            </div>

                            <div className="feed-post-add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentText[post._id] || ""}
                                    onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleComment(post._id);
                                    }}
                                />
                                <button
                                    className={commentText[post._id]?.trim() ? "active" : ""}
                                    onClick={() => handleComment(post._id)}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Sidebar */}
            <div className="feed-sidebar">
                <div className="sidebar-section">
                    <div className="sidebar-user-row">
                        {userData?.pfp ? (
                            <img src={userData.pfp} alt="" className="sidebar-user-avatar" />
                        ) : (
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
                                {user?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-username">{user}</div>
                            <div className="sidebar-user-fullname">
                                {userData?.fullName || user}
                            </div>
                        </div>
                        <span className="sidebar-switch-btn" onClick={() => navigate(`/${user}`)}>
                            Profile
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;