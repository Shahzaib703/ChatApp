import "./Style.css";
import Singin from "./Components/Singin";
import Register from "./Components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Components/NavBar"
import Chats from "./Components/Chats"
import Profile from "./Components/Profile";


function App() {
  
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
          <Route exact path="/ChatApp" element={<Chats />} />
          <Route exact path="/Profile" element={<Profile />} />
          <Route exact path="/login" element={<Singin />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
