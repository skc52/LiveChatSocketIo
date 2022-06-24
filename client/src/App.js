import React, {useEffect, useState} from 'react';
import './App.css';
import io from 'socket.io-client'
import Chat from './Chat';
import "./App.css";


const socket = io("http://localhost:3001");
socket.on("connect", ()=>{
  console.log(`Connected with id:${socket.id}`);
})


function App() {

  const [username, setUserName] = useState("");
  
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [registeredRoom, setRegisterRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomFound, setRoomFound] = useState(true);
  const [isNewRoom, setIsNewRoom] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  

  
 
  
  const joinRoom =  () => {
    if (username !== "" && room !== ""){
      //emit this info to the server
       
          socket.emit("join_room", room, username);
          
          
          setShowChat(true);
         
          return; 
      
    }
  }


 
  return (
    <div className="App">
        {!showChat ?
        <>
        
            <div className="joinChatContainer">
              <h3>Join a Room</h3>
              <input type="text" placeholder='Your username...' onChange={(e) => setUserName(e.target.value)}/>
              <input type="text" placeholder='Room ID...' onChange={(e) => setRoom(e.target.value)}/>
              <button onClick={joinRoom}>Join A Room</button>

              
            </div>

            {/* <h1>OR</h1>
            
            <div className="joinChatContainer">
              <h3>Register a Room</h3>
              <input type="text" placeholder='Type a name for your room...' 
                onChange={e => setRegisterRoom(e.target.value)}
                value = {registeredRoom}
              />
             {isRegistered && <p className='roomIsRegistered'>Successfully Registered!</p>}
             {!isNewRoom && <p className='notfoundRoom'>Please use another name for the room!</p>}
              <button onClick={registerRoom}>Register A Room</button>
          </div>

          <div className="allRooms">
            <h3>All Chat Rooms</h3>
            <ol>
              {rooms.map((room)=>{
                return(
                  <li>{room}</li>
                )
              })}
            </ol>
            
          </div> */}
        </>
        :
        <Chat socket = {socket} username = {username} room = {room} setShowChat = {setShowChat}/>}
    </div>
  );
}

export default App;





// const registerRoom = () =>{
//   if (registeredRoom!== ""){
    // rooms.map((r)=>{
    //   if (r===registeredRoom){
    //     console.log("room already registered!");
    //     setRoomAlreadyRegistered(true);
    //     setRegisterRoom("");
    //     return;
    //   }
    // })
//     const r = rooms.find((room)=>{
//       return room == registeredRoom;
//     })
//     if (!r){
//       socket.emit("create_room", registeredRoom);
//       if (rooms.length === 0){
//         setRooms([registerRoom]);
//       }
//       else{
//         setRooms((room)=>[...room, registeredRoom]);
//       }
      
//       console.log("registered a new room");
//       setIsNewRoom(true);
//       setIsRegistered(true);
//       setRegisterRoom("");
//     }
//     else{
//       console.log("room already registered. pick a different name for your room");
//       setIsRegistered(false);
//       setIsNewRoom(false);
//     }
    
    

//   }


  
// }

// useEffect(()=>{
//   socket.on("roomsList",(rooms)=>{
//     setRooms(rooms);
//   })
// },[ ])

// useEffect(()=>{
//   socket.on("roomsList",(rooms)=>{
//     setRooms(rooms);
//   })
// },[socket])
