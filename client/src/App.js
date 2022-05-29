import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageList from "./components/ImageList.js";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <h3>Image Management</h3>
      <UploadForm />
      <ImageList />
    </div>
  );
}

export default App;
