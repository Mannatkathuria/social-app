import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

function Settings() {

    const { dark, setDark } = useContext(AuthContext);
    const {setLogged, setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.setItem('logged', 'false');
        setLogged(false);
        setUser('');
        navigate('/login');
    }

    return (
        <>
            <h1>Settings</h1>

            <div className="flex gap-5 items-center justify-center mt-15">
                Theme → {dark ? "Dark" : "Light"}
            <button
                onClick={() =>
                    setDark(prev => !prev)
                }
                >
                Toggle Theme
            </button>
            </div>

            <br/>
            <button onClick={logout}>
                Log Out
            </button>
        </>
    );
}

export default Settings;