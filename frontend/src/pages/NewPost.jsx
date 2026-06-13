import { useState } from "react";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NewPost() {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const {user} = useContext(AuthContext)
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        setImage(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const post = async () => {
        try{

            const formData = new FormData();

            formData.append("user", user);
            formData.append("description", description);
            formData.append("image", image);

            const res = await api.post(
                "/users/post/add",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            navigate(`/${user}`)

        } catch(err) {
            console.log("Couldn't upload", err)
            setErrMsg(err?.data?.data || err?.data || "Netowrk error")
        }
    };

    return (
        <>
            <p className="mt-2">Add Image</p>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex mt-5 w-100 h-100 border-2 border-solid bored-grey"
            >
                {image ? (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <p>Drag image here</p>
                )}
            </div>

            <p className="mt-6">Add Description</p>

            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="add your thoughts"
            />

            <button
                className="mt-3 mb-5 border-2 border-solid border-grey p-2 rounded-l"
                onClick={post}
            >
                POST
            </button>

            <p className="error">{errMsg}</p>
        </>
    );
}

export default NewPost;