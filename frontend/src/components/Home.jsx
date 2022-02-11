import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

//import { Button } from './Button';
import Card from './Cards.jsx';


import '../assets/css/home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [trig, setTrig] = useState(false);
    const { user } = useContext(UserContext);

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

    useEffect(() => {
        get_posts()
    }, [trig])

    return (
        <div className="home">
            {posts.map((val, key) => {
                return (
                    <Card
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
