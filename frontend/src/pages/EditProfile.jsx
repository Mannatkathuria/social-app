import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditProfile() {
    const { user, userData, setUserData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [pfp, setPfp] = useState(null);
    const [pfpPreview, setPfpPreview] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (userData) {
            setFullName(userData.fullName || "");
            setBio(userData.bio || "");
            setEmail(userData.email || "");
            setPfpPreview(userData.pfp || "");
        }
    }, [user, userData]);

    const handlePfpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPfp(file);
            setPfpPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setErrMsg("");

        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("bio", bio);
            formData.append("email", email);
            if (pfp) formData.append("pfp", pfp);

            const res = await api.put(`/users/profile/${user}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setUserData(res.data.data);
            navigate(`/${user}`);
        } catch (err) {
            setErrMsg(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <div className="edit-profile-card">
                <div className="edit-pfp-section">
                    {pfpPreview ? (
                        <img src={pfpPreview} alt="" className="edit-pfp-preview" />
                    ) : (
                        <div className="edit-pfp-preview-placeholder">
                            {user.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label className="edit-pfp-btn" style={{ cursor: 'pointer' }}>
                        Change profile photo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePfpChange} />
                    </label>
                </div>

                {errMsg && <div className="auth-error">{errMsg}</div>}

                <div className="edit-form-group">
                    <label>Username</label>
                    <input type="text" value={user} disabled style={{ opacity: 0.6 }} />
                </div>

                <div className="edit-form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                    />
                </div>

                <div className="edit-form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="edit-form-group">
                    <label>Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write something about yourself..."
                        maxLength={150}
                    />
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
                        {bio.length}/150
                    </div>
                </div>

                <div className="edit-form-actions">
                    <button className="ig-btn ig-btn-outline" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button className="ig-btn ig-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;