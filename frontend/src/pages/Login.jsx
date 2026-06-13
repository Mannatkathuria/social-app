import { useState, useContext, useEffect } from "react";
import api from '../api/axios.js'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const { setLogged, setUser } = useContext(AuthContext);
    const {logged, user} = useContext(AuthContext);

    const [passType, setPassType] = useState("password");
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        localStorage.setItem('logged', logged)
    }, [logged])

    useEffect(() => {
        localStorage.setItem('user', user)
    }, [user])

    async function submit() {
        setErrorMsg("");

        if(newUser){
            try{
                const user = await api.post("/users/register", {
                    username,
                    password
                })

                setLogged(true);
                setUser(username);

                navigate('/')

            } catch(err) {
                console.log(err);
                const backendError = err.response?.data?.message || err.message || "Registration failed";
                setErrorMsg(backendError);
            }

            return;
        }

        try {
            const user = await api.post("/users/login", {
                username,
                password
            })

            setLogged(true);
            setUser(username);

            navigate('/')

        } catch(err) {
            console.log(err);
            const backendError = err.response?.data?.message || err.message || "Login failed";
            setErrorMsg(backendError);
        }
    }

    return (
        <>

            <div className="login">
                <div>Enter Username</div>

                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <div>Enter Password</div>

                <div className="flex">
                    <input
                        type={passType}
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={() =>
                            setPassType(prev =>
                                prev === "password" ? "text" : "password"
                            )
                        } id="visib"
                    >
                        {passType === "password" ? 'o' : '#'}
                    </button>
                </div>

                <button className="submit" onClick={submit}>
                    Submit
                </button>

                <br />

                <button
                    className="new-user"
                    onClick={() => setNewUser(prev => !prev)}
                >
                    {newUser ? "Log-in" : "Sign-up"}
                </button>

                <p className="error">{errorMsg}</p>
            </div>
        </>
    );
}

export default Login;