import React, { useState, useContext, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

import { UserContext } from '../context/UserContext';
import { PostContext } from '../context/PostContext';
import Dropdown from './Dropdown.jsx'

import UpdatePost from './UpdatePost.jsx';
import DeletePost from './DeletePost.jsx';



const Card = ({ id, post_id, name, title, content, created_at, index }) => {
    const { update, del } = useContext(PostContext);
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);


    const [isUser, setIsUser] = useState(false);

    const get_time = (time) => {
        var date = time.split(' ');
        var time = date[1].split('.');
        var created = date[0] + " " + time[0];

        return created;
    }

    useEffect(() => {
        if (user.name === name) {
            setIsUser(true);
        }
        else {
            setIsUser(false);
        }
    }, []);


    return (
        <div className="cards">
            {update && <UpdatePost />}
            {del && <DeletePost />}
            <div className="ico">
                <FaUserCircle />
            </div>
            <div className="post-cont">
                <div className="info">
                    <div className="details">
                        <p id={post_id} className="user-name" onClick={() => " "}> {name} </p>
                        <p className="date"> {get_time(created_at)}</p>
                    </div>
                    <div className="menu" onClick={() => setOpen(!open)}>
                        <BsThreeDots />
                        {open && <Dropdown index={index} isUser={isUser} />}
                    </div>
                </div>
                <hr />
                <div className="post-content">
                    <h1>{title}</h1>
                    <p>{content}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;
