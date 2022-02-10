import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Button } from './Button';

const Home = () => {
    const { logout } = useContext(UserContext);
    return (
        <div className="home">
            <h1>hello</h1>
            <Button buttonColor='blue' buttonSize='btn-mobile' type='submit' onClick={() => logout()}>
                Login
            </Button>
        </div>
    )
}

export default Home;
