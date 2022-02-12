import React from 'react';

import { AiFillDelete, AiTwotoneEdit, } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';

import DropItem from './DropItem.jsx';

import '../assets/css/dropdwon.css';

const Dropdown = ({ index, isUser }) => {

    return (
        <div className="dropdown">
            {isUser ?
                <>
                    <DropItem index={index} type="update" icon={<AiTwotoneEdit />} >Update</DropItem>
                    <DropItem index={index} type="delete" icon={<AiFillDelete />}>Delete</DropItem>
                </>
                :
                <DropItem index={index} type="view" icon={<BsSearch />}>View</DropItem>
            }
        </div>
    );
}

export default Dropdown;
