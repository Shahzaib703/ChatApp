import React from "react";
import ChatsBox from "../chats/chatsBox";
import MassageBox from "../chats/MassageBox";
import AllUsers from "./AllUsers";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { getDatabase, onDisconnect, ref, set, update } from "firebase/database";
import { auth } from "../firebase";

const Chats = () => {
  const [NewUid, setNewUid] = React.useState(null);

  const { user } = useContext(AuthContext);
  React.useEffect(() => {
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
      {user ? (
        <>
          <div className="AllUsersBox">
            <AllUsers showChat={showChat} />
          </div>
          <div className="Chats">
            <ChatsBox showChat={showChat} />
            {NewUid ? (
              <MassageBox NewUid={NewUid} />
            ) : (
              <div
                style={{
                  width: 400,
                  height: 400,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "auto",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Wellcome To Chat App
                </h3>
                <p style={{ textAlign: "center" }}>(Created By G.M.Shahzaib)</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <h2 style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          You Need To Login
        </h2>
      )}
    </>
  );
};

export default Chats;
