import React from 'react';

import '../assets/css/dropdwon.css';


const DropItem = ({ icon, children }) => {


    return (
        <div className="menu-item">
            <p className="ic"> {icon} </p>
            <p > {children} </p>
        </div>
    );


}


export default DropItem;
