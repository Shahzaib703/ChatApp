import React, { useEffect, useState, useRef } from "react";
import MassageRowLeft from "./MassageRowLeft";
import MassageRowRight from "./MassageRowRight";
import MassageInput from "./MassageInput";
import { auth } from "../firebase";
import {
  getDatabase,
  ref,
  onChildAdded,
  onChildRemoved,
  off,
  onChildChanged,
  get,
  child,
  onValue,
  update,
} from "firebase/database";

const MassageBox = ({ NewUid }) => {
  const db = getDatabase();
  const dummy = useRef();

  const [Massages, setMassages] = useState([]);

  useEffect(() => {
    const reference = ref(db, `Massages/${auth.currentUser.uid}/${NewUid}`);

    function change(snapshot) {
      const data = Massages.filter((Msg) => {
        return Msg.key !== snapshot.key;
      });
      setMassages(data);
      setMassages((data) => [
        ...data,
        { ...snapshot.val(), key: snapshot.key },
      ]);
    }
    function removed(snapshot) {
      const data = Massages.filter((Msg) => {
        return Msg.key !== snapshot.key;
      });
      setMassages(data);
    }
    onChildChanged(reference, change);
    onChildRemoved(reference, removed);

    return () => {
      off(reference, change);
      off(reference, removed);
    };
  }, [Massages]);

  useEffect(() => {
    setMassages([]);
    const reference = ref(db, `Massages/${auth.currentUser.uid}/${NewUid}`);

    function add(snapshot) {
      let MyUid = auth.currentUser.uid;
      let FromId = snapshot.child("From").val();
      if (FromId !== MyUid && snapshot.child("Seen").val() !== true) {
        get(
          child(
            ref(getDatabase()),
            `/Massages/${FromId}/${MyUid}/${snapshot.key}`
          )
        )
          .then((snapshot) => {
            if (snapshot.exists()) {
              const updates = {};

              //Seen
              updates[
                "/Massages/" +
                  MyUid +
                  "/" +
                  FromId +
                  "/" +
                  snapshot.key +
                  "/Seen"
              ] = true;
              updates[
                "/Massages/" +
                  FromId +
                  "/" +
                  MyUid +
                  "/" +
                  snapshot.key +
                  "/Seen"
              ] = true;

              update(ref(db), updates);
            } else {
              alert("NO Exits");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      setMassages((Msgs) => [
        ...Msgs,
        { ...snapshot.val(), key: snapshot.key },
      ]);

      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
    onChildAdded(reference, add);

    return () => {
      off(reference);
    };
  }, [NewUid]);

  return (
    <>
      {NewUid ? (
        <div className="MassageBoxP">
          <div className="profileRow">
            <ProfileRow Uid={NewUid} />
          </div>
          <div className="MassageBox">
            {Array.from(Massages).map((Msg, index) => {
              return Msg.From === auth.currentUser.uid ? (
                Massages.length - 1 === index ? (
                  <div key={index}>
                    <MassageRowRight data={Msg} DoShowSend={true} />
                  </div>
                ) : (
                  <div key={index}>
                    <MassageRowRight data={Msg} DoShowSend={false} />
                  </div>
                )
              ) : (
                <div key={index}>
                  <MassageRowLeft data={Msg} />
                </div>
              );
            })}
            <div ref={dummy}></div>
          </div>
          <div>
            <MassageInput data={NewUid} />
          </div>
        </div>
      ) : null}
    </>
  );
};

function ProfileRow({ Uid }) {
  const [Image, setImage] = useState("");
  const [Name, setName] = useState("");
  const [Status, setStatus] = useState("Offline");
  const db = getDatabase();

  useEffect(() => {
    onValue(ref(db, `/Users/${Uid}`), (snapshot) => {
      let photo = snapshot.child("Profile").val();
      let username = snapshot.child("username").val();

      let status = snapshot.child("status").val();
      setStatus(status);

      setName(username);

      if (photo !== "") {
        setImage(photo);
      } else {
        setImage("/user_icon.jpg");
      }
    });

    return () => {
      off(ref(db, `/Users/${Uid}`));
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid var(--color-4)",
        padding: "10px",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${Image} )`,
        }}
        className="ProfilePic"
        src={Image}
        alt="Avatar"
      />
      <div style={{ marginLeft: "10px" }}>
        <h2 className="whiteClass">{Name}</h2>
        <h6 className="whiteClass">{Status}</h6>
      </div>
    </div>
  );
}

export default MassageBox;
