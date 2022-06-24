import React, {useState, useEffect} from 'react';
import "./App.css";
import ScrollToBottom from 'react-scroll-to-bottom';
function Chat({socket, username, room, setShowChat}) {
    const [currentMsg, setCurrentMsg] = useState("");
    const [msgList, setMsgList] = useState([]);
    const [users, setUsers] = useState([]);


    
    
    
    const sendMessage = async () =>{
        if (currentMsg!==""){
            const msgData = {
                room: room,
                author:username,
                message: currentMsg,
                time: new Date(Date.now()).getHours()+":" + new Date(Date.now()).getMinutes(),

            };

            await socket.emit("send_message", msgData);
            setMsgList((list)=>[...list, msgData]);
            setCurrentMsg("");
        }
    }

    const leave = async() =>{
        await socket.emit("leaveChat", room, username);
        // await socket.emit("disconnect");
        setShowChat(false);
    }

    useEffect(()=>{
        socket.on("newUserNotification", (data)=>{
            
            const notification = {
                author: "chatBot",
                isNotification:true,
                message:`${data} has joined the room`,
                time: new Date(Date.now()).getHours()+":" + new Date(Date.now()).getMinutes(),
            };
            setMsgList((list)=>[...list, notification])
            
        });

        socket.on("leftChat", name =>{
            const notification = {
                author: "chatBot",
                isNotification:true,
                message:`${name} has left the room`,
                time: new Date(Date.now()).getHours()+":" + new Date(Date.now()).getMinutes(),
            };
            setMsgList((list)=>[...list, notification])
        })
        
        socket.on("usersList", (data)=>{
            const thisRoomUsers = data.filter(user=>{
                return user.room === room;
                
            })
            // thisRoomUsers.map(user=>{
            //     console.log(user);
            // })
            setUsers(thisRoomUsers);
            users.map(user=>{
                console.log(user.username);
            })
        })

        socket.on("receive_message", (data)=>{
            setMsgList((list)=>[...list, data])
        });

        return;
    }, [socket]);


  return (
    <>
      
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat - {room}</p>
                
            </div>
            <button onClick={leave}>Leave Chat</button>
            <div className="chat-body">
                <ScrollToBottom className='message-container'>
                    {msgList.map((msg)=>{
                        return(
                                <div className="message" id = {username === msg.author? "you":"other"}>
                                    <div>
                                        <div className="message-content">

                                            {msg.author==="chatBot" ? 
                                                <div className="notificationMsg">
                                                    <p><small>{msg.message}</small></p>
                                                </div>
                                                :
                                            <p>{msg.message} </p>}
                                                
                                            
                                        </div>
                                        <div className="message-meta">
                                            <p id='time'>{msg.time} </p>
                                            <p id='author'> {msg.author}</p>
                                        </div>
                                    </div>
                                </div>
                            
                            )
                    })}
                </ScrollToBottom>
                
            </div>
            <div className="chat-footer">
                <input type="text" placeholder='Write your message...' value = {currentMsg}
                onKeyPress = {(e)=>{e.key === "Enter" && sendMessage() }}
                onChange={(e) => setCurrentMsg(e.target.value)}/>
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
        
        <div className='participants'>
                    <h3>Participants</h3>
                    
                        <ol>
                        {users.map(user=>{
                            return(<li>{user.username}</li>)
                        })}
                        </ol>
                    
                    
        </div>
       
   
    </>
  )
}

export default Chat