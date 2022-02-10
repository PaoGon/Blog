import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

import { LoginProps } from './LoginProps.jsx';
import { Button } from './Button';

import '../assets/css/bttn.css';
import '../assets/css/login.css';
import '../assets/css/input.css';



const Login = () => {
    const { login_user } = useContext(UserContext);
    const [errMsg, setErrMsg] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",

    });

    const reset = () => {
        setErrMsg("");
    }

    const getData = (val) => {
        setData({
            ...data,
            [val.target.name]: val.target.value
        });

    }
    const submitForm = async (e) => {
        e.preventDefault();
        const res = await login_user(data);
        if (res.success) {
            console.log('test1', localStorage.getItem('loginToken'));
        }
        else {
            setErrMsg(res.message);
            console.log(res.message);
        }
    }
    return (
        <form className='login' onSubmit={e => submitForm(e)}>
            <div className="log-cont">
                <h1 className='title'>Login</h1>
                {errMsg ? <div className="err">{errMsg}</div> : ""}
                <div className="log-inputs">
                    {LoginProps.map((val, key) => {
                        return (
                            <div className="wrapper" key={key}>
                                <input
                                    type={val.type}
                                    name={val.name}
                                    placeholder={val.place_holder}
                                    size={val.size}
                                    onChange={getData}
                                    required
                                    onClick={() => reset()}
                                    autoFocus={val.auto}
                                />
                                <div className="validation">*Required</div>

                            </div>
                        );
                    })}
                </div>
                <div className="log-btn">
                    <Button buttonColor='light-blue' buttonSize='btn-mobile' type='submit'>
                        Login
                    </Button>
                </div>

            </div>
        </form>
    )
}
export default Login;
