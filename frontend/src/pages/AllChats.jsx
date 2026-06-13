import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AllChats() {
    const { user: loggedInUser } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get(
                    `/users/chats/${loggedInUser}`
                );

                setChats(res.data.data);
            } catch (err) {
                console.log("Couldn't fetch chats", err);
            }
        };

        if (loggedInUser) fetchChats();
    }, [loggedInUser]);

    return (
        <div className="chats">
            <h1 className="my-7">All Chats</h1>
            {chats.length === 0 ? (
                <p>No chats yet</p>
            ) : (
                chats.map((user) => (
                    <div key={user}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px",
                                cursor: "pointer",
                                border: "1px solid white",
                                width: "100%"
                            }}
                            onClick={() =>
                                navigate(`/chatbox/${user}`)
                            }
                        >
                            {user}
                        </span>
                        
                    </div>
                ))
            )}
        </div>
    );
}

export default AllChats;