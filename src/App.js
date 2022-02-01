import "./Style.css";
import Singin from "./Components/Singin";
import Register from "./Components/Register";
import { useContext } from "react";
import { AuthContext } from "./context/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Components/NavBar"
import Chats from "./Components/Chats"
import Profile from "./Components/Profile";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
          {user?<Route exact path="/" element={<Chats />} />: null}
          <Route exact path="/Profile" element={<Profile />} />
          <Route exact path="/login" element={<Singin />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
