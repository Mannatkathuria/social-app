import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [logged, setLogged] = useState(localStorage.getItem("logged") === 'true');
    const [user, setUser] = useState(localStorage.getItem('user') || "");
    const [userData, setUserData] = useState(null);
    const [dark, setDark] = useState(localStorage.getItem('dark') === 'true');

    // On mount, if token exists, fetch user data
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem('user');
        if (token && storedUser && logged) {
            api.get(`/users/${storedUser}`)
                .then(res => {
                    setUserData(res.data.data || res.data);
                })
                .catch(() => {
                    // Token might be expired
                    localStorage.removeItem("token");
                    setLogged(false);
                    setUser("");
                });
        }
    }, [logged]);

    const login = (username, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        localStorage.setItem('logged', 'true');
        setUser(username);
        setLogged(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('logged', 'false');
        localStorage.setItem('user', '');
        setLogged(false);
        setUser('');
        setUserData(null);
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            dark ? "dark" : "light"
        );

        localStorage.setItem("dark", dark.toString());
    }, [dark]);

    return (
        <AuthContext.Provider
            value={{
                logged,
                setLogged,
                user,
                setUser,
                userData,
                setUserData,
                dark,
                setDark,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;