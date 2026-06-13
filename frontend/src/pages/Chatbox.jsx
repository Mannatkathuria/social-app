import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Chatbox() {
    const { username } = useParams();
    const { user: loggedInUsername } = useContext(AuthContext);

    const [messageLog, setMessageLog] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await api.get(
                    `/users/chatbox/${username}`,
                    {
                        params: {
                            user: loggedInUsername
                        }
                    }
                );

                console.log("GET RESPONSE:", response.data);

                setMessageLog(response.data.data);
            }
            catch (err) {
                console.log("GET ERROR:", err.response?.data);
            }
        }

        if (loggedInUsername) {
            fetchMessages();
        }
    }, [username, loggedInUsername]);

    async function sendMessage() {
        if (!message.trim()) return;

        try {
            const response = await api.post(
                `/users/chatbox/${username}`,
                {
                    sender: loggedInUsername,
                    text: message
                }
            );

            console.log("POST RESPONSE:", response.data);

            setMessageLog(prev => [
                ...prev,
                response.data.data
            ]);

            setMessage("");
        }
        catch (err) {
            console.log("POST ERROR:", err.response?.data);
        }
    }

    return (
        <div>
            <h2>Chat with {username}</h2>

            <div
                className="chat-window"
                style={{
                    border: "1px solid black",
                    height: "400px",
                    overflowY: "auto",
                    padding: "10px",
                    margin: "10px",
                    width: "100%"
                }}
            >
                {messageLog.length === 0 ? (
                    <p>No messages yet</p>
                ) : (
                    messageLog.map((msg) => (
                    <div
                        key={msg._id}
                        style={{
                            display: "flex",
                            justifyContent:
                                msg.sender === loggedInUsername
                                    ? "flex-end"
                                    : "flex-start",
                            margin: "8px 0",
                            width: "100%"
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 12px",
                                border: "1px solid gray",
                                borderRadius: "12px",
                                background:
                                    msg.sender === loggedInUsername
                                        ? "green"
                                        : "blue",
                                width: "auto",
                                wordBreak: "break-word"
                            }}
                        >
                            {msg.text}
                        </span>
                    </div>
                    ))
                )}
            </div>

            <div>
                <input
                    type="text"
                    value={message}
                    placeholder="Type a message..."
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatbox;