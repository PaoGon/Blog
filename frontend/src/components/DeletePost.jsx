import React, { useContext, useState } from 'react';

import { AiFillDelete } from 'react-icons/ai';

import { Button } from './Button';
import { PostContext } from '../context/PostContext';

import '../assets/css/delete.css';


const DeletePost = () => {
    const { delete_post, index, posts, setDel, setErrMsg, setSucMsg } = useContext(PostContext);
    const data = {
        id: posts[index].post_id,
        user_id: posts[index].id,
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const res = await delete_post(data);
        if (res.success) {
            setSucMsg(res.message);
            setDel(false);
        }
        else {
            setErrMsg(res.message);
            setDel(false);
        }
    }

    return (
        <div className="del">
            <form className="del-card" onSubmit={e => submitForm(e)}>
                <div className="del-cont">
                    <div className="del-ico">
                        <AiFillDelete />

                    </div>
                    <div className="del-msg">
                        <h1>Are you sure?</h1>
                        <div className="test">
                            <p>Do you realy want to delete this post?</p>
                            <p>This action cannot be undone</p>

                        </div>

                    </div>

                </div>
                <div className="del-btn">
                    <Button buttonColor='gray' onClick={() => setDel(false)}> Cancel </Button>
                    <Button buttonColor='orange' type='submit'> Delete </Button>
                </div>
            </form>
        </div>
    );

}
export default DeletePost;
