import React from "react";
import { getDatabase, ref, onValue, get,child, remove, off } from "firebase/database";
import { auth } from "../firebase";

const ChatRow = (props) => {
  const [S_Img, setImage] = React.useState(null);

  const [S_Name, setName] = React.useState(null);

  const [S_LastMsg, setLastMsg] = React.useState(null);

  const [S_Time, setTime] = React.useState(null);

  const [isOnline, setOnline] = React.useState(false);

  
  const { LastMsg, MsgType, time, Uid } = props.data;

  const db = getDatabase();

  React.useEffect(() => {
    onValue(ref(db, `Users/${Uid}`), (snapshot) => {
      let name =snapshot.child("username").val();
      let status = snapshot.child("status").val();
      let profile = snapshot.child("Profile").val();

      setName(name);
      timeSince(time);
      if (status === "Online") {
        setOnline(true);
      } else {
        setOnline(false);
      }

      if (profile === "" || profile === null) {
        setImage("/user_icon.jpg");
      } else {
        setImage(profile);
      }
    });

    onValue(ref(db, `Massages/${auth.currentUser.uid}/${Uid}/${LastMsg}`), (snapshot) => {
      if (snapshot.exists()) {
        setLastMsg(snapshot.child("TextMSG").val());
        // if (!snapshot.child("From").val()===auth.currentUser.uid) {
        //     let isSeen = snapshot.child("Seen").val()
        //     if (isSeen) {
        //         // holder.newMsgIndicator.setVisibility(View.GONE);
        //     } else {
        //         // holder.newMsgIndicator.setVisibility(View.VISIBLE);
        //     }
        // } else {
        //     // holder.newMsgIndicator.setVisibility(View.GONE);
        // }
      } else {
        setLastMsg("Massage deleted.");
        // holder.newMsgIndicator.setVisibility(View.GONE);
      }
    });

    const interval = setInterval(() => timeSince(time), 1000);
    return () => {
      off(ref(db, `Users/${Uid}`))
      clearInterval(interval);
    };
  }, [props]);

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      setTime(Math.floor(interval) + " years ago");
      return;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      setTime(Math.floor(interval) + " months ago");
      return;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      setTime(Math.floor(interval) + " days ago");
      return;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      setTime(Math.floor(interval) + " hours ago");
      return;
    }
    interval = seconds / 60;
    if (interval > 1) {
      setTime(Math.floor(interval) + " min ago");
      return;
    }
    if (Math.floor(seconds) < 3) {
      setTime("Just Now");
      return;
    }
    setTime(Math.floor(seconds) + " sec ago");
  }

  return (
    <>
      <div className="ChatRow">
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundImage: `url(${S_Img} )`,
            }}
            className="ProfilePic"
            src={S_Img}
            alt="Avatar"
          />
          {isOnline ? <div className="OnlineIndicator"></div> : null}
          <div className="ChatNL">
            <h3 className="whiteClass">{S_Name}</h3>
            <h5 className="whiteClass">{S_LastMsg}</h5>
          </div>
        </div>
        <h5 className="ChatTime whiteClass">{S_Time}</h5>
      </div>
    </>
  );
};

export default ChatRow;
