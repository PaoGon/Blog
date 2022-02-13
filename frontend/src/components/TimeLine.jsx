import React, { useState, useEffect, useContext } from 'react';
import { PostContext } from '../context/PostContext.jsx';
import { UserContext } from '../context/UserContext.jsx';

import Card from './Cards.jsx';


import '../assets/css/home.css';

const Home = () => {
    const { user } = useContext(UserContext);
    const { ownPosts, get_own_posts } = useContext(PostContext);




    useEffect(() => {
        async function asyncCall() {
            await get_own_posts(user.id);
        }
        asyncCall();
    }, [])

    return (

        <div className="home">
            {ownPosts.map((val, key) => {
                return (
                    <Card
                        index={key}
                        id={user.id}
                        post_id={val.post_id}
                        name={user.name}
                        title={val.title}
                        content={val.content}
                        created_at={val.created_at}
                        key={key}
                    />
                )
            })}
        </div>
    )
}

export default Home;
