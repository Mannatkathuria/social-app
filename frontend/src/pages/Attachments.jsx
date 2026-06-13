import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Attachments() {
    const { user } = useParams();

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [selected, setSelected] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                const response = await api.get(
                    "/users/attachments",
                    {
                        params: { user }
                    }
                );

                const {
                    followers,
                    following
                } = response.data.data;

                setFollowers(followers || []);
                setFollowing(following || []);
                setErrMsg("");
            } catch (err) {
                setErrMsg(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load attachments"
                );
            }
        };

        fetchAttachments();
    }, [user]);

    const list = selected ? following : followers;

    return (
        <>
            <div className="flex gap-10">
                <strong
                    className="cursor-pointer my-5"
                    style={{
                        color: selected ? "grey" : "white"
                    }}
                    onClick={() => setSelected(false)}
                >
                    Followers
                </strong>

                <strong
                    className="cursor-pointer my-5"
                    style={{
                        color: selected ? "white" : "grey"
                    }}
                    onClick={() => setSelected(true)}
                >
                    Following
                </strong>
            </div>

            {errMsg && (
                <p className="err">{errMsg}</p>
            )}

            {!errMsg && list.length === 0 && (
                <p>
                    {selected
                        ? "Not following anyone."
                        : "No followers yet."}
                </p>
            )}

            {list.map((u) => (
                <div
                    key={u._id}
                    onClick={() =>
                        navigate(`/${u.username}`)
                    }
                    className="border-2 border-s border-grey cursor-pointer"
                >
                    {u.username}
                </div>
            ))}
        </>
    );
}

export default Attachments;