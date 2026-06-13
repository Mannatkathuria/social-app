import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const { user, logged } = useContext(AuthContext);

    const [searchUser, setSearchUser] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getUser = () => {
        if (searchUser.trim()) {
            navigate(`/${searchUser.trim()}`);
        } else {
            setErrMsg("Please enter a username to search");
        }
    };

    useEffect(() => {
        if (!user) return;

        const loadFeed = async () => {
            try {
                setLoading(true);

                const res = await api.get("/users/feed", {
                    params: {
                        username: user
                    }
                });

                setPosts(res.data.data || []);
                setErrMsg("");
            } catch (err) {
                setErrMsg(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load feed"
                );
            } finally {
                setLoading(false);
            }
        };

        loadFeed();
    }, [user]);

    if (!logged) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {/* SEARCH BAR */}
            <div className="mb-6">
                <input
                    placeholder="Search user"
                    value={searchUser}
                    onChange={(e) => {
                        setSearchUser(e.target.value);
                        setErrMsg("");
                    }}
                />

                <button onClick={getUser}>
                    Search
                </button>

                {errMsg && (
                    <p className="error">{errMsg}</p>
                )}
            </div>

            {/* FEED */}
            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No posts in your feed yet.</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        maxWidth: "600px"
                    }}
                >
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="border-2 border-grey rounded-xl p-4"
                        >
                            <strong
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    navigate(`/${post.owner.username}`)
                                }
                            >
                                {post.owner.username}
                            </strong>

                            <img
                                src={post.file}
                                alt="post"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    cursor: "pointer"
                                }}
                                onClick={() =>
                                    navigate(`/post/${post._id}`)
                                }
                            />

                            <p className="mt-2">
                                {post.description}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "15px",
                                    marginTop: "10px"
                                }}
                            >
                                <span>
                                    ❤️ {post.likes?.length || 0}
                                </span>

                                <span>
                                    💬 {post.comments?.length || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Dashboard;