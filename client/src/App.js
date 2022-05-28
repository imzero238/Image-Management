import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <h3>Image Management</h3>
      <UploadForm />
    </div>
  );
}

export default App;
