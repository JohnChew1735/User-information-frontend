import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../Home/Home";
import UserData from "../UserData/UserData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user-data" element={<UserData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
