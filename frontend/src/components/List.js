import React from 'react';
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import "../index.css";

const List = ({ id, task, updateMode, removeTask }) => {

    const handleRemoveTask = () => {
        removeTask(id);
    };

    return (
        <li className="task_item">
            <span className="task_text">{task}</span>
            <div className="icon_holder">
                <BiEditAlt className='icon' onClick={() => updateMode(id, task)}/>
                <BsTrash className='icon' onClick={handleRemoveTask}/>
            </div>
        </li>
    );
};

export default List;
