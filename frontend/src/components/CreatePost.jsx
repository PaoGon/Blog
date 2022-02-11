import React, { useState } from 'react';

import { PostProps } from './PostProps.jsx'
import '../assets/css/create.css';




const CreatePost = () => {
    const [data, setData] = useState({
        title: "",
        content: "",

    });

    //const reset = () => {
    //setErrMsg("");
    //}

    const getData = (val) => {
        setData({
            ...data,
            [val.target.name]: val.target.value
        });

    }
    return (
        <div className="home">
            <div className="cards">
                <div className="post-cont">
                    <div className="info">
                        <h1 className="post-head">New Post</h1>
                    </div>
                    <hr />
                    <div className="post-c">
                        {PostProps.map((val, key) => {
                            return (
                                <div className="wrapper" key={key}>
                                    <input
                                        type={val.type}
                                        name={val.name}
                                        placeholder={val.place_holder}
                                        size={val.size}
                                        onChange={getData}
                                        required
                                        //onClick={() => reset()}
                                        autoFocus={val.auto}
                                    />
                                    <div className="validation">*Required</div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
