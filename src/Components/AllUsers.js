import React, { useEffect, useState } from "react";
import { onValue, ref, getDatabase, off } from "firebase/database";
import { auth } from "../firebase";

const AllUsers = ({ showChat }) => {
  const [AllUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "/AllUsers"), (snapshot) => {
      let array = [];
      snapshot.forEach((snap) => {
        if(snap.key!==auth.currentUser.uid){
          array.push(snap.key);
        }
      });
      setAllUsers(array);
    });

    return () => {
      off(ref(db, "/AllUsers"));
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {Array.from(AllUsers).map((key, index) => {
        return <div style={{cursor:"pointer"}} key={index} onClick={() => showChat(key)}><UsersRow  Uid={key} /></div>;
      })}
    </div>
  );
};

function UsersRow({ Uid }) {
  const [Image, setImage] = useState("/user_icon.jpg");
  const [Name, setName] = useState("UserName");  
  const [isOnline, setOnline] = useState(false);


  useEffect(() => {
    let db = getDatabase();
    onValue(ref(db, `/Users/${Uid}`), (snapShot) => {
      let Photo = snapShot.child("Profile").val();
      let name = snapShot.child("username").val();
      let status = snapShot.child("status").val();
      setName(name);
      
      if (Photo !== "") {
        setImage(Photo);
      } else {
        setImage("/user_icon.jpg");
      }
      if (status === "Online") {
        setOnline(true);
      } else {
        setOnline(false);
      }
    });

    return () => {
      off(ref(db, `/Users/${Uid}`));
    };
  }, []);

  return (
    <div className="UserContainer">
      <div
        style={{
          backgroundImage: `url(${Image} )`,
        }}
        className="ProfilePic"
        src={Image}
        alt="Avatar"
      />
      
      {isOnline ? <div className="OnlineIndicator"></div> : null}
      <h5 className="userName whiteClass">{Name}</h5>
    </div>
  );
}

export default AllUsers;
