import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    
    const [logged, setLogged] = useState(localStorage.getItem("logged") === 'true');

    // localStorage.setItem('logged', false);

    const [user, setUser] = useState(localStorage.getItem('user') || "");

    const [dark, setDark] = useState(localStorage.getItem('dark') === 'true');

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            dark ? "dark" : "light"
        );

        localStorage.setItem(
            "dark",
            dark.toString()
        );
    }, [dark]);

    return (
        <AuthContext.Provider
            value={{
                logged,
                setLogged,
                user,
                setUser,
                dark,
                setDark
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;