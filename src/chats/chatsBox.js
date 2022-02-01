import React, { useState, useEffect } from "react";
import ChatRow from "./ChatRow";
import {
  getDatabase,
  ref,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
  off,
} from "firebase/database";
import { auth } from "../firebase";
const ChatsBox = ({ showChat }) => {
  const [Chats, setChats] = useState([]);

  const db = getDatabase();

  useEffect(() => {
    if(!auth.currentUser.uid){
      return
    }
    
    let reference = ref(db, `Chats/${auth.currentUser.uid}`);

    function change(snapshot) {
      const data = Chats.filter((chat) => {
        return chat.Uid !== snapshot.key
      });
      setChats(data);
      setChats((item) => [
        {
          LastMsg: snapshot.child("LastMsg").val(),
          MsgType: snapshot.child("MsgType").val(),
          time: snapshot.child("time").val(),
          Uid: snapshot.key,
        },
        ...item,
      ]);
    }

    onChildChanged(reference, change);

    function remove(snapshot) {
      const data = Chats.filter((chat) => {
        return chat.Uid !== snapshot.key
      });
      setChats(data);
    }
    onChildRemoved(reference, remove);

    return () => {
      off(reference, change);
      off(reference, remove);
    };
  }, [Chats]);

  useEffect(() => {
    let reference = ref(db, `Chats/${auth.currentUser.uid}`);

    function add(snapshot) {
      setChats((item) => [
        ...item,
        {
          LastMsg: snapshot.child("LastMsg").val(),
          MsgType: snapshot.child("MsgType").val(),
          time: snapshot.child("time").val(),
          Uid: snapshot.key,
        },
      ]);
    }
    onChildAdded(reference, add);
    return () => {
      off(reference, add);
    };
  }, []);

  return (
    <div className="chatBox">
      <h3 className="whiteClass" style={{ marginBottom:"10px", borderBottom:"1px solid var(--color-4)"}} >Chats:</h3>
      {Array.from(Chats).map((chat, index) => {
        return (
          <div key={index} onClick={() => showChat(chat.Uid)}>
            <ChatRow data={chat} />
          </div>
        );
      })}
    </div>
  );
};

export default ChatsBox;
