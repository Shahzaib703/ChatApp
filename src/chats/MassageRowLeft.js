import { getDatabase, off, onValue, ref } from "firebase/database";
import React from "react";

const MassageRowLeft = ({ data }) => {
  const { From, MsgType, Seen, Send, TextMSG, time } = data;

  const [Profile, setProfile] = React.useState("");

  React.useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, `/Users/${From}/Profile`), (snapshot) => {
      let photo = snapshot.val();
      var icon = "https://firebasestorage.googleapis.com/v0/b/massagingapp-4fa3c.appspot.com/o/user_icon.jpg?alt=media&token=bcd8233d-66e9-45e2-bd63-b34bc1b006cd";
      
      if (photo !== "") {
        setProfile(photo);
      } else {
        setProfile(icon);
      }
    });

    return () => {
      off(ref(db, `/Users/${From}/Profile`));
    };
  }, []);

  return (
    <div className="received Massage">
      <div
        style={{
          backgroundImage: `url(${Profile})`,
        }}
        className="MsgPic"
        src={Profile}
        alt="Avatar"
      />

      <p>
        {TextMSG}
        <h6 style={{ textAlign: "left" ,backgroundColor:"#e5e5ea" }}>{ConvetTime(time)}</h6>
      </p>
    </div>
  );
};

function ConvetTime(timeStamp) {
  let date = new Date(timeStamp);
  var hours = date.getHours();
  var mints = date.getMinutes();

  //Switch For Hource
  switch (hours + "") {
    case "0":
    case "12":
      hours = "12";
      break;
    case "1":
    case "13":
      hours = "1";
      break;
    case "2":
    case "14":
      hours = "2";
      break;
    case "3":
    case "15":
      hours = "3";
      break;
    case "4":
    case "16":
      hours = "4";
      break;
    case "5":
    case "17":
      hours = "5";
      break;
    case "6":
    case "18":
      hours = "6";
      break;
    case "7":
    case "19":
      hours = "7";
      break;
    case "8":
    case "20":
      hours = "8";
      break;
    case "9":
    case "21":
      hours = "9";
      break;
    case "10":
    case "22":
      hours = "10";
      break;
    case "11":
    case "23":
      hours = "11";
      break;
    default:
      hours = "error";
      break;
  }

  //Switch For Mints
  switch (mints + "") {
    case "0":
      mints = "00";
      break;
    case "1":
      mints = "01";
      break;
    case "2":
      mints = "02";
      break;
    case "3":
      mints = "03";
      break;
    case "4":
      mints = "04";
      break;
    case "5":
      mints = "05";
      break;
    case "6":
      mints = "06";
      break;
    case "7":
      mints = "07";
      break;
    case "8":
      mints = "08";
      break;
    case "9":
      mints = "09";
      break;
    default:
      mints = mints;
      break;
  }

  return `${hours}:${mints}`;
}

export default MassageRowLeft;
