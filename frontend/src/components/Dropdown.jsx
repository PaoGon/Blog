import React from 'react';

import { AiFillDelete, AiTwotoneTool } from 'react-icons/ai';
//import { GrPowerReset } from 'react-icons/gr';

import DropItem from './DropItem.jsx';

import '../assets/css/dropdwon.css';

const Dropdown = ({ isUser }) => {
    console.log(isUser)

    return (
        <div className="dropdown">
            {isUser ?
                <>
                    <DropItem icon={<AiTwotoneTool />}>Update</DropItem>
                    <DropItem icon={<AiFillDelete />}>Delete</DropItem>
                </>
                :
                <DropItem>View</DropItem>
            }
        </div>
    );
}

export default Dropdown;
