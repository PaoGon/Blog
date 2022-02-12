import React, { useContext } from 'react';

import '../assets/css/dropdwon.css';
import { PostContext } from '../context/PostContext';


const DropItem = ({ index, type, icon, children }) => {
    const { posts, setPosts, update, del, setIndex, setUpdate, setDel } = useContext(PostContext);

    const setState = () => {

        if (type === "update") {
            setIndex(index);
            setUpdate(!update);
        }
        else if (type === "delete") {
            setIndex(index);
            setDel(!del);
        }
        else if (type == "view") {
            setPosts(posts.splice(index));
            //setTrig(!trig);
        }

    }

    return (
        <div className="menu-item" onClick={() => setState()}>
            <p className="ic"> {icon} </p>
            <p > {children} </p>
        </div >
    );


}


export default DropItem;
