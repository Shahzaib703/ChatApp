import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import {
  onValue,
  ref as dbref,
  getDatabase,
  off,
  update,
} from "firebase/database";

const Profile = () => {
  const inputFileRef = React.useRef();
  const [Image, setImage] = useState("");
  const [Name, setName] = useState("");

  const db = getDatabase();

  useEffect(() => {
    onValue(dbref(db, `/Users/${auth.currentUser.uid}`), (snapshot) => {
      let photo = snapshot.child("Profile").val();
      let username = snapshot.child("username").val();

      setName(username);

      if (photo !== "") {
        setImage(photo);
      } else {
        setImage("/user_icon.jpg");
      }
    });

    return () => {
      off(dbref(db, `/Users/${auth.currentUser.uid}`));
    };
  }, []);

  const onFileChangeCapture = (e) => {
    const storageRef = ref(
      getStorage(),
      `profilepics/${auth.currentUser.uid}.png`
    );

    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        update(dbref(getDatabase(), `/Users/${auth.currentUser.uid}/`), {
          Profile: downloadURL,
        });
      });
    });
  };
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  return (
    <div>
      <div className="mainProfile">
        <div
          style={{
            backgroundImage: `url(${Image} )`,
          }}
          className="ProfilePhoto"
          src={Image}
          alt="Avatar"
        />

        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChangeCapture={onFileChangeCapture}
        />
        <button style={{color:"white",padding:"8px",marginTop:"5px"}} onClick={onBtnClick}>uploadImg</button>
      <h2 style={{color:"white",marginTop:"5px"}}>{Name}</h2>
      </div>
    </div>
  );
};

export default Profile;
