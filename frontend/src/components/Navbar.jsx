import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { IoIosCreate } from 'react-icons/io';

import '../assets/css/nav.css';

import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const { isAuth, logout } = useContext(UserContext);

    return (
        <nav className="navbar">
            <div className="clk">
                <NavLink className='hd' to='/home'>Blog</NavLink>
                <NavLink className='nav-title' to='/'>Documentation</NavLink>
            </div>

            {isAuth ?
                <li className="ic">
                    <NavLink className="nav-title" to='/create-post'>New Post</NavLink>
                    <NavLink className="nav-title" to='/timeline'>Timeline</NavLink>
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
