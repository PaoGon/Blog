import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

import { PostProps } from './PostProps.jsx'
import { Button } from './Button';

import '../assets/css/create.css';
import '../assets/css/textarea.css';



const CreatePost = () => {
    const { user } = useContext(UserContext);

    const [errMsg, setErrMsg] = useState("");
    const [sucMsg, setSucMsg] = useState("");
    const [data, setData] = useState({
        user_id: user.id,
        title: "",
        content: "",

    });

    const reset = () => {
        setErrMsg("");
        setSucMsg("");
    }

    const getData = (val) => {
        setData({
            ...data,
            [val.target.name]: val.target.value
        });

    }

    const create_post = async () => {
        const login_token = localStorage.getItem('login_token');
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${login_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const res = await fetch("http://blog.local/api/create_post", requestOptions);
            const data = await res.json();

            if (data.success === 1) {
                return data;

            } else {
                return data;
            }
        } catch (err) {
            return { success: 0, message: 'Server Error!' };
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const res = await create_post();
        if (res.success) {
            setSucMsg(res.message);
        }
        else {
            setErrMsg(res.message);
        }
    }
    return (
        <div className="home">
            {errMsg ? <div className="post-err">{errMsg}</div> : ""}
            {sucMsg ? <div className="post-succ">{sucMsg}</div> : ""}
            <form className="create" onSubmit={e => submitForm(e)}>
                <div className="post-cont">
                    <div className="info">
                        <h1 className="post-head">New Post</h1>
                    </div>
                    <hr />
                    <div className="post-c">
                        {PostProps.map((val, key) => {
                            return (
                                <div className="wrapper" key={key}>
                                    <textarea
                                        className={val.class}
                                        name={val.name}
                                        placeholder={val.place_holder}
                                        maxLength={val.len}
                                        onChange={getData}
                                        autoFocus={val.auto}
                                        onClick={() => reset()}
                                    >
                                    </textarea>
                                    <div className="validation">*Required</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="create-btn">
                        <Button buttonStyle='btn--outline' type='submit'> Post </Button>
                    </div>
                </div>
            </form>
        </div >
    );
}

export default CreatePost;
