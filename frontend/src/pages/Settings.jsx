import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

function Settings() {
    const { dark, setDark, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            <div className="settings-section">
                <div className="settings-section-title">Account</div>
                <div className="settings-row">
                    <span className="settings-row-label">Username</span>
                    <span className="settings-row-value">@{user}</span>
                </div>
                <div className="settings-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/edit-profile')}>
                    <span className="settings-row-label">Edit Profile</span>
                    <span className="settings-row-value">→</span>
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-title">Preferences</div>
                <div className="settings-row">
                    <span className="settings-row-label">Dark Mode</span>
                    <button
                        onClick={() => setDark(prev => !prev)}
                        className="ig-btn ig-btn-small"
                        style={{
                            background: dark ? 'var(--accent)' : 'var(--bg-tertiary)',
                            color: dark ? 'white' : 'var(--text)',
                            border: '1px solid var(--border)',
                            minWidth: 80,
                        }}
                    >
                        {dark ? "🌙 On" : "☀️ Off"}
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-title">Support</div>
                <div className="settings-row">
                    <span className="settings-row-label">About</span>
                    <span className="settings-row-value">Instagram Clone v1.0</span>
                </div>
            </div>

            <button
                className="ig-btn ig-btn-danger ig-btn-full"
                style={{ marginTop: 8 }}
                onClick={handleLogout}
            >
                Log Out
            </button>
        </div>
    );
}

export default Settings;