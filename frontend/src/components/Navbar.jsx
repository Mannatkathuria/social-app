import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function Navbar({ title }){
    const { logged, user, userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const focusSearch = () => {
        searchInputRef.current?.focus();
    };

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (q.trim().length < 1) {
            setSearchResults([]);
            setShowSearch(false);
            return;
        }
        try {
            const res = await api.get("/users/search", { params: { q } });
            setSearchResults(res.data.data || []);
            setShowSearch(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="top-nav">
                <div className="nav-inner">
                    <Link to="/" className="nav-logo">
                        <span className="nav-logo-icon">📷</span>
                        <span>{title || "Instagram"}</span>
                    </Link>

                    <div className="nav-search" ref={searchRef}>
                        <span className="nav-search-icon">🔍</span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchQuery.trim() && setShowSearch(true)}
                        />
                        {showSearch && (
                            <div className="search-results-dropdown">
                                {searchResults.length === 0 ? (
                                    <div className="search-result-item" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                        No results found
                                    </div>
                                ) : (
                                    searchResults.map(u => (
                                        <div
                                            key={u._id}
                                            className="search-result-item"
                                            onClick={() => {
                                                navigate(`/${u.username}`);
                                                setShowSearch(false);
                                                setSearchQuery("");
                                            }}
                                        >
                                            <div className="search-result-avatar">
                                                {u.pfp ? (
                                                    <img src={u.pfp} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="search-result-name">{u.username}</div>
                                                {u.fullName && <div className="search-result-fullname">{u.fullName}</div>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="nav-actions">
                        <Link to="/" className="nav-action-btn" title="Home">🏠</Link>
                        {logged && (
                            <>
                                <Link to="/chat" className="nav-action-btn" title="Messages">💬</Link>
                                <Link to="/addpost" className="nav-action-btn" title="New Post">➕</Link>
                                {userData?.pfp ? (
                                    <img
                                        src={userData.pfp}
                                        alt=""
                                        className="nav-avatar"
                                        onClick={() => navigate(`/${user}`)}
                                    />
                                ) : (
                                    <div
                                        className="nav-avatar-placeholder"
                                        onClick={() => navigate(`/${user}`)}
                                    >
                                        {user?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </>
                        )}
                        {!logged && (
                            <Link to="/login" className="ig-btn ig-btn-primary ig-btn-small">Log In</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Nav (Mobile) */}
            <div className="bottom-nav">
                <span className="bottom-nav-btn" onClick={() => navigate('/')}>🏠</span>
                <span className="bottom-nav-btn" onClick={focusSearch}>🔍</span>
                {logged ? (
                    <>
                        <span className="bottom-nav-btn" onClick={() => navigate('/chat')}>💬</span>
                        <span className="bottom-nav-btn" onClick={() => navigate('/addpost')}>➕</span>
                        <span className="bottom-nav-btn" onClick={() => navigate(`/${user}`)}>👤</span>
                        <span className="bottom-nav-btn" onClick={handleLogout}>🚪</span>
                    </>
                ) : (
                    <span className="bottom-nav-btn" onClick={() => navigate('/login')}>🔑</span>
                )}
            </div>
        </>
    )
}

export default Navbar