import '../index.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function Navbar({ title }){
    const {logged, user} = useContext(AuthContext);

    return (
        <header>
            <div className='flex'>{title}</div>
            <div className='flex links'>
                <Link to="/chat">Messagaes</Link>
                <Link to="/">Home</Link>
                {logged && <Link to={`/${user}`}>Profile</Link>}
                {!logged && <Link to="/login">Login</Link>}
                <Link to="/settings">Settings</Link>
            </div>
        </header>
    )
}

export default Navbar