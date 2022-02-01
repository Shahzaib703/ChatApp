import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { getDatabase, onDisconnect,ref, set, update } from "firebase/database";

import { useNavigate } from "react-router-dom";

const Singin = () => {
  
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const {  email, password, error, loading} = data;


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    return;
    }
  
    setData({ ...data, error: null, loading: true });
  

    try {
      await signInWithEmailAndPassword(auth, email, password);

      

      navigate("/");

    } catch (error) {
      setData({ ...data, error: error.message, loading: false });
    }
  };

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <section>
      <h3>Sing In</h3>
      <form className="form" onSubmit={handleSubmit}>
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
            {loading ? "Singing In ..." : "Sing In"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Singin;
