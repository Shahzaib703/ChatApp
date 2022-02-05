import React from "react";
import { auth } from "../firebase";

import {
  getDatabase,
  ref,
  child,
  push,
  update,
  get,
} from "firebase/database";

const MassageInput = ({ data }) => {
  const [Text, setText] = React.useState("");
  let MyUid = auth.currentUser.uid;
  const db = getDatabase();

  let MsgType = "Text";
  let timeStamp = new Date().getTime();

  const sendMsg = (e) => {
    e.preventDefault();
    let Msg = Text;
    if(Msg===""){
      return;
    }
    setText("");

    // Get a key for a new Msg.
    const MassageId = push(child(ref(db), "/Chats")).key;

    const updates = {};

    //Chat
    updates["/Chats/" + MyUid + "/" + data + "/LastMsg"] = MassageId;
    updates["/Chats/" + data + "/" + MyUid + "/LastMsg"] = MassageId;

    //time
    //TIMESTAMP IS NOT MADE
    updates["/Chats/" + MyUid + "/" + data + "/time"] = timeStamp;
    updates["/Chats/" + data + "/" + MyUid + "/time"] = timeStamp;

    //Massage Type
    //MSGTYPE IS NOT MADE
    updates["/Chats/" + MyUid + "/" + data + "/MsgType"] = MsgType;
    updates["/Chats/" + data + "/" + MyUid + "/MsgType"] = MsgType;

    //Massage From
    updates["/Chats/" + MyUid + "/" + data + "/From"] = MyUid;
    updates["/Chats/" + data + "/" + MyUid + "/From"] = MyUid;

    //Msgs
    updates["/Massages/" + MyUid + "/" + data + "/" + MassageId + "/TextMSG"] =
      Msg;
    updates["/Massages/" + data + "/" + MyUid + "/" + MassageId + "/TextMSG"] =
      Msg;
    updates["/Massages/" + MyUid + "/" + data + "/" + MassageId + "/From"] =
      MyUid;
    updates["/Massages/" + data + "/" + MyUid + "/" + MassageId + "/From"] =
      MyUid;

    //TimeStampIsNOtSeted
    updates["/Massages/" + MyUid + "/" + data + "/" + MassageId + "/time"] =
      timeStamp;
    updates["/Massages/" + data + "/" + MyUid + "/" + MassageId + "/time"] =
      timeStamp;

    //seen function
    updates[
      "/Massages/" + MyUid + "/" + data + "/" + MassageId + "/Send"
    ] = false;
    updates[
      "/Massages/" + MyUid + "/" + data + "/" + MassageId + "/Seen"
    ] = false;
    updates[
      "/Massages/" + data + "/" + MyUid + "/" + MassageId + "/Seen"
    ] = false;

    //Massage Type
    //MsgType
    updates["/Massages/" + MyUid + "/" + data + "/" + MassageId + "/MsgType"] =
      MsgType;
    updates["/Massages/" + data + "/" + MyUid + "/" + MassageId + "/MsgType"] =
      MsgType;

    update(ref(db), updates).then((results) => {
      get(child(ref(db), `/Massages/${MyUid}/${data}/${MassageId}/`)).then(
        (snapshot) => {
          if (snapshot.exists) {
            const updateSent = {};
            //Send
            updateSent[
              "/Massages/" + MyUid + "/" + data + "/" + MassageId + "/Send"
            ] = true;

            update(ref(db), updateSent);
          }
        }
      );
    });
  };
  

  return (
    <div className="MassageInput">
      <input
        className="inputField"
        type="text"
        value={Text}
        onChange={(evt) => setText(evt.target.value)}
      ></input>
      <button className="inputBtn" onClick={sendMsg}>
        send
      </button>
    </div>
  );
};

export default MassageInput;
