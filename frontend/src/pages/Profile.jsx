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
    const { user: loggedInUsername } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleFollowToggle = async () => {
        setLoading(true);

        try {
            const res = await api.post(
                `/users/follow/${username}`,
                { currentUsername: loggedInUsername }
            );

            const newStatus = res.data.data.isFollowing;

            setIsFollowing(newStatus);

            setUserData(prev => ({
                ...prev,
                followers: newStatus
                    ? [...prev.followers, { username: loggedInUsername }]
                    : prev.followers.filter(
                        f => f.username !== loggedInUsername
                    )
            }));
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Something went wrong changing status"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await api.get(`/users/${username}`);

            setUserData(res.data.data);

            const alreadyFollowing = res.data.data.followers?.some(
                follower =>
                    follower === loggedInUsername ||
                    follower.username === loggedInUsername
            );

            const fetchPost = await api.get('/users/post', {
                params: { user: username }
            });

            setPosts(fetchPost?.data?.data || fetchPost?.data || []);
            setIsFollowing(!!alreadyFollowing);

        } catch (err) {
            setErrMsg(
                err.response?.data?.message ||
                err.message
            );
        }
    };

    useEffect(() => {
        if (username) {
            fetchUserData();
        }
    }, [username, loggedInUsername]);

    if (errMsg) return <p className="error">{errMsg}</p>;
    if (!userData) return <p>404 User doesn't exist</p>;

    return (
        <>
            <h1> User </h1>
            <h1 className="my-4">{userData.username}</h1>

            <div className="flex gap-40">

                <div>
                    <h2>Posts</h2>
                    <p> {userData.posts.length} </p>
                </div>

                <div className="curson-pointer" onClick={() => navigate(`/${username}/attachments`)}>
                    <h2>Followers</h2>
                    <p> {userData.followers.length} </p>
                </div>

                <div className="curson-pointer" onClick={() => navigate(`/${username}/attachments`)}>
                    <h2>Following</h2>
                    <p> {userData.following.length} </p>
                </div>

            </div>

            {username !== loggedInUsername && 
            <div className="flex gap-60 my-6">
                <button onClick={() => navigate(`/chatbox/${username}`)}>Message</button>

                <button onClick={handleFollowToggle} disabled={loading}>
                    {loading ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
            </div>
            }

            {username === loggedInUsername && 
            <div className="flex gap-60 mb-6">
                <button className="mt-3 mb-5 border-2 border-solid border-grey p-2 rounded-l" onClick={() => navigate('/addpost')}>Add post</button>
            </div>
            }

            <div
                className="post-section"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, 180px)",
                    gap: "4px",
                    width: "100%",
                    maxWidth: "900px"
                }}
            >
                {posts.map((post) => (
                    <img
                        key={post._id}
                        src={post.file}
                        alt="post"
                        style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(`/post/${post._id}`)}
                    />
                ))}
            </div>
        </>
    );
}

export default Profile;