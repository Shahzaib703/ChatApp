import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import {auth} from '../firebase'
import { onDisconnect,ref,getDatabase,update } from "firebase/database";
import React from "react";



const NavBar = () => {
  const {user} = React.useContext(AuthContext);

  const singOut =(e)=>{
    e.preventDefault();
    try{
      auth.signOut();
      
      update(ref(getDatabase(),`/Users/${auth.currentUser.uid}/`),{status:"Offline"})
      onDisconnect(ref(getDatabase(),`/Users/${auth.currentUser.uid}/`)).cancel();
      alert("SingOUT");
    }catch(err){
      console.log(err.message);
    }
}

  return (
    <nav>
      <h3>
        <Link to="/ChatApp">Massages</Link>
      </h3>
      <div>
        {user ? (
          <>
          <Link to="/Profile">Profile</Link>
            <button className="btn" onClick={singOut}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
