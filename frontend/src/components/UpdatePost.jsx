import React, { useContext, useState } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';

import { Button } from './Button';
import { PostContext } from '../context/PostContext';

import '../assets/css/update.css';
import '../assets/css/textarea.css';

const UpdatePost = () => {
    const { update_post, index, posts, setUpdate } = useContext(PostContext);
    const details = [posts[index]];
    const [data, setData] = useState({
        id: posts[index].post_id,
        user_id: posts[index].id,
        title: posts[index].title,
        content: posts[index].content,
    });

    const get_time = (time) => {
        var date = time.split(' ');
        var time = date[1].split('.');
        var created = date[0] + " " + time[0];

        return created;
    }

    const getData = (val) => {
        setData({
            ...data,
            [val.target.name]: val.target.value
        });

    }

    const submitForm = async (e) => {
        e.preventDefault();
        const res = await update_post(data);
        if (res.success) {
            //setSucMsg(res.message);
            setUpdate(false);
        }
        else {
            //setErrMsg(res.message);
            setUpdate(false);
        }
    }

    return (
        <div className="update" >
            <div className="close" onClick={() => setUpdate(false)}>
                <FaTimes />
            </div>
            {details.map((val, key) => {
                return (
                    < div className="up" key={key}>
                        <div className="ico">
                            <FaUserCircle />
                        </div>
                        <form className="post-cont" onSubmit={e => submitForm(e)}>
                            <div className="info">
                                <div className="details">
                                    <p id={val.post_id} className="user-name" onClick={() => " "}> {val.name} </p>
                                    <p className="date"> {get_time(val.created_at)}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="post-c">
                                <textarea name="title" className="post-title" defaultValue={val.title} onChange={getData}></textarea>
                                <textarea name="content" className="post-content" defaultValue={val.content} onChange={getData}></textarea>
                            </div>
                            <div className="update-btn">
                                <Button buttonStyle='btn--outline' type='submit'> Update </Button>
                            </div>
                        </form>
                    </div >
                );
            })}
        </div >
    )
}

export default UpdatePost;
