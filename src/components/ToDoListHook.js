import React, { useState } from 'react';

export default function ToDoList(props) {
    const [text, setText] = React.useState('');
    const [items, setItems] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        setItems([...items, text]);
        setText('');
    }
    function handleClick(index){
        const data = items;
        data.splice(index, 1);
        setItems([...data]);
    }
    function handleCheck(index){
        
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" required placeholder='Enter something' value={text} onChange={(event) => setText(event.target.value)}></input>
                <input type="submit"></input>
                <label className='labelerror' hidden></label>
            </form>
            <ul>
                {items.map((item, index) => (
                    <li key={index}> <input type="checkbox"></input>  {item}<button onClick={() => handleClick(index)}>Remove</button></li>
                ))}
            </ul>
        </div>
    );
}