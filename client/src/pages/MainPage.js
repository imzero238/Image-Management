import React from "react";
import UploadForm from "../components/UploadForm";
import ImageList from "../components/ImageList";

const MainPage = () => {
    return (
        <div>
            <h3>Image Management</h3>
            <UploadForm />
            <ImageList />
        </div>
    );
};

export default MainPage;