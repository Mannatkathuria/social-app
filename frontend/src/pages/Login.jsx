import { useState, useContext } from "react";
import api from '../api/axios.js'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login, logged } = useContext(AuthContext);

    const [passType, setPassType] = useState("password");
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function submit() {
        setErrorMsg("");

        if (newUser) {
            try {
                const res = await api.post("/users/register", { username, password });
                const token = res.data.data.accessToken;
                login(username, token);
                navigate('/');
            } catch (err) {
                const backendError = err.response?.data?.message || err.message || "Registration failed";
                setErrorMsg(backendError);
            }
            return;
        }

        try {
            const res = await api.post("/users/login", { username, password });
            const token = res.data.data.accessToken;
            login(username, token);
            navigate('/');
        } catch (err) {
            const backendError = err.response?.data?.message || err.message || "Login failed";
            setErrorMsg(backendError);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <h1>📷</h1>
                    <p className="subtitle">
                        {newUser
                            ? "Sign up to see photos from your friends."
                            : "Sign in to see photos from your friends."}
                    </p>

                    {errorMsg && <div className="auth-error">{errorMsg}</div>}

                    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value.toLowerCase())}
                            required
                        />
                        <div style={{ position: 'relative' }}>
                            <input
                                type={passType}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setPassType(prev => prev === "password" ? "text" : "password")}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 4
                                }}
                            >
                                {passType === "password" ? "Show" : "Hide"}
                            </button>
                        </div>
                        <button type="submit" className="ig-btn ig-btn-primary ig-btn-full">
                            {newUser ? "Sign Up" : "Log In"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <div className="auth-toggle">
                        {newUser ? (
                            <>Have an account? <a onClick={() => setNewUser(false)}>Log in</a></>
                        ) : (
                            <>Don't have an account? <a onClick={() => setNewUser(true)}>Sign up</a></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;