import React, { useContext } from "react";
import UploadForm from "../components/UploadForm";
import ImageList from "../components/ImageList";
import { AuthContext } from "../context/AuthContext";

const MainPage = () => {
    const [me] = useContext(AuthContext);

    return (
        <div>
            <h3>Image Management</h3>
            {me && <UploadForm />}
            <ImageList />
        </div>
    );
};

export default MainPage;