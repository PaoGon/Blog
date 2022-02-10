import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import '../assets/css/nav.css';

import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const { isAuth, logout } = useContext(UserContext);

    return (
        <nav>
            <div className="clk">
                <NavLink to='/'>Blog</NavLink>
            </div>

            {isAuth ?
                <li className="ic">
                    <a className="nav-title" onClick={() => {
                        logout()
                        window.location.pathname = "/login"

                    }} href='#!'>Logout</a>
                </li>
                :
                <li className="ic">
                    <NavLink className="nav-title" to='/login'>Login</NavLink>
                    <NavLink className="nav-title" to='/signup'>Signup</NavLink>
                </li>
            }
        </nav>
    );
}

export default Navbar;
