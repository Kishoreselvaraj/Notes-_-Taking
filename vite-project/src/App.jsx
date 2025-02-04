import React from "react";
import { BrowserRouter ,Routes, Route} from 'react-router-dom';
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx"; // Import the default export
import Dashboard from "./pages/Dashboard.jsx";
// import Dash from "./pages/Dash2.jsx"
// const dotenv=require("dotenv");
// require('dotenv').config();


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Use as a JSX element */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Use as a JSX element */}
        {/* <Route path="/dashboard1" element={<Dash />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
