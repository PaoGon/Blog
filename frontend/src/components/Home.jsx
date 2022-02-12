import React, { useState, useEffect, useContext } from 'react';
import { PostContext } from '../context/PostContext';

import Card from './Cards.jsx';


import '../assets/css/home.css';

const Home = () => {
    const { trig, get_posts, posts } = useContext(PostContext);



    useEffect(() => {
        get_posts()
    }, [trig])

    return (

        <div className="home">
            {posts.map((val, key) => {
                return (
                    <Card
                        index={key}
                        id={val.id}
                        post_id={val.post_id}
                        name={val.name}
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
