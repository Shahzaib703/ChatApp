import React, { useMemo } from "react";
import ChatsBox from "../chats/chatsBox";
import MassageBox from "../chats/MassageBox";
import AllUsers from "./AllUsers";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { getDatabase, onDisconnect, ref, set, update } from "firebase/database";
import { auth } from "../firebase";

const Chats = () => {
  const [NewUid, setNewUid] = useState(null);

  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      update(ref(getDatabase(), `/Users/${auth.currentUser.uid}/`), {
        status: "Online",
      });
      onDisconnect(
        ref(getDatabase(), `/Users/${auth.currentUser.uid}/`)
      ).update({ status: "offline" });
    }
  });

  function showChat(UserID) {
    setNewUid(UserID);
  }

  return (
    <>
      <div className="AllUsersBox">
        <AllUsers showChat={showChat} />
      </div>
      <div className="Chats">
        <ChatsBox showChat={showChat} />
        {NewUid ? 
        <MassageBox NewUid={NewUid} />
        : null}
      </div>
    </>
  );
};

export default Chats;
