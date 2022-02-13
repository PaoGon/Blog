import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [update, setUpdate] = useState(false);
    const [del, setDel] = useState(false);
    const [index, setIndex] = useState();
    const [trig, setTrig] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [sucMsg, setSucMsg] = useState("");

    const get_posts = async () => {
        const login_token = localStorage.getItem('login_token');
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${login_token}`,
                "Content-Type": "application/json",
            },
        };
        const res = await fetch("http://blog.local/api/get_posts", requestOptions);
        const data = await res.json();

        try {
            setPosts(data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const update_post = async (data) => {
        const login_token = localStorage.getItem('login_token');
        const requestOptions = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${login_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const res = await fetch("http://blog.local/api/update_post", requestOptions);
            const data = await res.json();

            if (data.success === 1) {
                setTrig(!trig);
                return data;

            } else {
                return data;
            }
        } catch (err) {
            return { success: 0, message: 'Server Error!' };
        }
    }

    const delete_post = async (data) => {
        const login_token = localStorage.getItem('login_token');
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${login_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const res = await fetch("http://blog.local/api/delete_post", requestOptions);
            const data = await res.json();

            if (data.success === 1) {
                setTrig(!trig);
                return data;

            } else {
                return data;
            }
        } catch (err) {
            return { success: 0, message: 'Server Error!' };
        }
    }

    return (
        <PostContext.Provider value={{
            get_posts,
            delete_post,
            update_post,
            index, setIndex,
            trig,
            setTrig,
            posts,
            setPosts,
            update,
            setUpdate,
            del,
            setDel,
            errMsg,
            setErrMsg,
            sucMsg,
            setSucMsg
        }}>
            {children}
        </PostContext.Provider>
    );

}


