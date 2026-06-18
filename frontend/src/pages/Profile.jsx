import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const { user: loggedInUsername } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/users/follow/${username}`, { currentUsername: loggedInUsername });
            const newStatus = res.data.data.isFollowing;
            setIsFollowing(newStatus);
            setFollowersCount(prev => newStatus ? prev + 1 : prev - 1);
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await api.post("/users/post/delete", { post_id: postId, username: loggedInUsername });
            setPosts(prev => prev.filter(p => p._id !== postId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await api.get(`/users/${username}`);
            const data = res.data.data || res.data;
            setUserData(data);
            setFollowersCount(data.followers?.length || 0);
            setFollowingCount(data.following?.length || 0);

            const alreadyFollowing = data.followers?.some(
                f => f === loggedInUsername || f.username === loggedInUsername
            );

            const fetchPost = await api.get('/users/post', { params: { user: username } });
            setPosts(fetchPost?.data?.data || fetchPost?.data || []);
            setIsFollowing(!!alreadyFollowing);
        } catch (err) {
            setErrMsg(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        if (username) fetchUserData();
    }, [username, loggedInUsername]);

    if (errMsg) return <div className="loading-page"><p>{errMsg}</p></div>;
    if (!userData) return <div className="loading-page"><p>Loading...</p></div>;

    const isOwnProfile = username === loggedInUsername;

    return (
        <div className="profile-page">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar-section">
                    {userData.pfp ? (
                        <img src={userData.pfp} alt="" className="profile-avatar-lg" />
                    ) : (
                        <div className="profile-avatar-lg-placeholder">
                            {username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="profile-info">
                    <div className="profile-top-row">
                        <h1>{username}</h1>
                        {isOwnProfile ? (
                            <>
                                <button className="ig-btn ig-btn-outline ig-btn-small" onClick={() => navigate('/edit-profile')}>
                                    Edit Profile
                                </button>
                                <button className="ig-btn ig-btn-outline ig-btn-small" onClick={() => navigate('/settings')}>
                                    Settings
                                </button>
                            </>
                        ) : (
                            <button
                                className={`ig-btn ${isFollowing ? 'ig-btn-outline' : 'ig-btn-primary'} ig-btn-small`}
                                onClick={handleFollowToggle}
                                disabled={loading}
                            >
                                {loading ? "..." : isFollowing ? "Following" : "Follow"}
                            </button>
                        )}
                    </div>

                    <div className="profile-stats-row">
                        <div className="profile-stat">
                            <span className="profile-stat-value">{posts.length}</span>
                            <span className="profile-stat-label">posts</span>
                        </div>
                        <div className="profile-stat" style={{ cursor: 'pointer' }} onClick={() => navigate(`/${username}/attachments`)}>
                            <span className="profile-stat-value">{followersCount}</span>
                            <span className="profile-stat-label">followers</span>
                        </div>
                        <div className="profile-stat" style={{ cursor: 'pointer' }} onClick={() => navigate(`/${username}/attachments`)}>
                            <span className="profile-stat-value">{followingCount}</span>
                            <span className="profile-stat-label">following</span>
                        </div>
                    </div>

                    {userData.fullName && <div className="profile-fullname">{userData.fullName}</div>}
                    {userData.bio && <div className="profile-bio">{userData.bio}</div>}
                    {userData.email && <div className="profile-email">{userData.email}</div>}

                    {!isOwnProfile && (
                        <div className="profile-actions-row">
                            <button className="ig-btn ig-btn-primary ig-btn-small" onClick={() => navigate(`/chatbox/${username}`)}>
                                Message
                            </button>
                        </div>
                    )}
                    {isOwnProfile && (
                        <div className="profile-actions-row">
                            <button className="ig-btn ig-btn-primary ig-btn-small" onClick={() => navigate('/addpost')}>
                                New Post
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
                <div className="profile-tab active">
                    <span>📷</span> Posts
                </div>
            </div>

            {/* Posts Grid */}
            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post._id} className="post-grid-item">
                        <img
                            src={post.file}
                            alt="post"
                            onClick={() => navigate(`/post/${post._id}`)}
                        />
                        <div className="post-grid-overlay">
                            <span>❤️ {post.likes?.length || 0}</span>
                            <span>💬 {post.comments?.length || 0}</span>
                        </div>
                        {isOwnProfile && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id); }}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '4px 8px',
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    zIndex: 2
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="no-posts">
                    <div className="no-posts-icon">📷</div>
                    <p>No posts yet</p>
                    {isOwnProfile && (
                        <button className="ig-btn ig-btn-primary" onClick={() => navigate('/addpost')}>
                            Share your first post
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;