// import React, { useState } from "react";

// export default function CreateRoom(props){
//     const [roomname, setRoomname] = useState();

//     function handleSubmit(event){
//         event.preventDefault();
//         props.onSubmit();
//         setRoomname('');
//     }

//     return(<form onSubmit={handleSubmit}>
//         <input type="alphanumeric" required value={roomname} onChange={(event)=> setRoomname(event.target.value)}></input>
//         <input type="submit"></input>
//     </form>)
// }