import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

import Navbar from './components/Navbar.jsx';
import Login from './components/Login';
import Home from './components/Home';
import Docu from './components/Docu.jsx';
import Signup from './components/Signup.jsx';
import CreatePost from './components/CreatePost.jsx';

function App() {
    const { user } = useContext(UserContext);

    return (
        <div className="container">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {user &&
                        <>
                            <Route exact path="/home" element={<Home />} />
                            <Route exact path="/create-post" element={<CreatePost />} />
                        </>
                    }
                    {!user && (
                        <>
                            <Route exact path="/" element={<Docu />} />
                            <Route exact path="/login" element={<Login />} />
                            <Route exact path="/signup" element={<Signup />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to={user ? '/home' : '/login'} />} /> </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
