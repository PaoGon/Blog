import React, { createContext, useState, useEffect } from 'react';


export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [wait, setWait] = useState(false)

    const checkAuthenticated = async () => {
        const login_token = localStorage.getItem('login_token');

        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${login_token}`,
                "Content-Type": "application/json",
            },
            cache: "no-cache"
        };

        console.log(login_token);

        if (login_token) {
            const res = await fetch("http://blog.local/api/get_user", requestOptions);
            const data = await res.json();
            if (data.success && data.user) {
                setUser(data.user);
                setIsAuth(true)
                return;
            }
            setUser(null);
        }
    }

    const login_user = async (data) => {
        setWait(true);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const res = await fetch("http://blog.local/api/accounts/login.php", requestOptions)
            const data = await res.json()

            if (data.success && data.token) {
                localStorage.setItem('login_token', data.token)

                setWait(false);
                return { success: 1 };

            } else {
                setWait(false);
                return { success: 0, message: data.message };
            }
        } catch (err) {
            setWait(false);
            return { success: 0, message: 'Server Error!' };
        }
    }

    const logout = () => {
        console.log('logout: ', localStorage.getItem('login_token'))
        localStorage.removeItem('login_token');
        setUser(null);
        setIsAuth(false);
        console.log('logout: ', localStorage.getItem('login_token'))
    }

    useEffect(() => {
        async function asyncCall() {
            await checkAuthenticated();
        }
        asyncCall();
    }, [wait]);

    return (
        <UserContext.Provider value={{ login_user, logout, user, isAuth }}>
            {children}
        </UserContext.Provider>
    );
}
