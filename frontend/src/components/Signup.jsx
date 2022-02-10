import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

import { SignupProps } from './SignupProps.jsx';
import { Button } from './Button';

import '../assets/css/bttn.css';
import '../assets/css/login.css';
import '../assets/css/input.css';


const Signup = () => {
    const { signup_user } = useContext(UserContext);
    const [errMsg, setErrMsg] = useState("");
    const [sucMsg, setSucMsg] = useState("");
    const [data, setData] = useState({
        email: "",
        password: "",

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
    const submitForm = async (e) => {
        e.preventDefault();
        const res = await signup_user(data);
        if (res.success) {
            setSucMsg(res.message);
        }
        else {
            setErrMsg(res.message);
            console.log(res.message);
        }
    }

    return (
        <form className='login' onSubmit={e => submitForm(e)}>
            <div className="log-cont">
                <h1 className='title'>Signup</h1>
                {errMsg ? <div className="err">{errMsg}</div> : ""}
                {sucMsg ? <div className="succ">{sucMsg}</div> : ""}
                <div className="log-inputs">
                    {SignupProps.map((val, key) => {
                        return (
                            <div className="wrapper" key={key}>
                                <input
                                    type={val.type}
                                    name={val.name}
                                    placeholder={val.place_holder}
                                    size={val.size}
                                    id={val.id}
                                    onChange={getData}
                                    required
                                    autoFocus={val.auto}
                                    onClick={() => reset()}
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
    );
}

export default Signup;
