import logo from './logo.svg';
import './App.css';
import React from 'react';
import P1 from './components/Marie.js';
import ToDoList from './components/ToDoListHook';
import { sample } from './components/w3schools/classes.js'
import HotelManagementTemplate from './components/Hotel Management Activity/HotelTemplate';
import Hide from './components/HideButtons';

// import P2 from './components/Jose.js';
// import P3 from './components/Adam.js';

function App() {
  return (
    <div className="App">
      <h2 className='text-3xl'>Hotel Management</h2>
      {/* <HotelManagementTemplate></HotelManagementTemplate> */}
      <P1 name="Marie" age="21"></P1>
    </div>
  );
}
export default App;
