import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageList from "./components/ImageList.js";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto"}}>
      <ToastContainer />
      <h3>Image Management</h3>
      <UploadForm />
      <ImageList />
    </div>
  );
}

export default App;
