import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";
import ImagePage from "./pages/ImagePage";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto"}}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/images/:imageId" exact element={< ImagePage />} />
        <Route path="/" exact element={< MainPage />} />
        <Route path="/auth/signup" exact element={< SignupPage />} />
        <Route path="/auth/login" exact element={< LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;