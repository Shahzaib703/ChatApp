import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import { getDatabase, onDisconnect,ref, set, child,get } from "firebase/database";

const Register = () => {
  const [data, setData] = React.useState({
    username: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const {email, password, error, loading, username } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setData({ ...data, error: "All fields are required" });
      return;
    }
    setData({ ...data, error: null, loading: true });

    const dbRef = ref(getDatabase());
    get(child(dbRef, "AllUsers/"))
      .then((snapshot) => {
        let Names = [];
        let DoesMach = false;
        if (snapshot.exists) {
          snapshot.forEach((snap) => {
            let name = snap.child("UserName").val();
            Names.push(name);
          });
          Names.forEach((namea) => {
            if (namea === username) {
              DoesMach = true;
            }
          });
        }
        if (DoesMach) {
          setData({ ...data, error: "Username already exist", loading: false });
        } else {
          try {
            createUserWithEmailAndPassword(auth, email, password).then(
              (result) => {
                const db = getDatabase();
                let uid = result.user.uid;

                set(ref(db, "AllUsers/" + uid), {
                  UserName: username,
                })

                set(ref(db, "Users/" + uid), {
                  email,
                  username,
                  id: uid,
                  status: "Online",
                  typingTo: "noOne",
                  Profile: "https://firebasestorage.googleapis.com/v0/b/massagingapp-4fa3c.appspot.com/o/user_icon.jpg?alt=media&token=bcd8233d-66e9-45e2-bd63-b34bc1b006cd",
                });
              }
            );
            
            navigate("/ChatApp");
          } catch (err) {
            setData({ ...data, error: err.message, loading: false });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <section>
      <h3>Create An Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">UserName</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Creating ..." : "Register"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
