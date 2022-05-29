import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageList = () => {
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios
            .get("/images")
            .then((result) => setImages(result.data))
            .catch((err) => console.error(err));
    }, []);
    const imgList = images.map((image) => (
        <img style={{width:"100%"}} src={`http://localhost:5050/uploads/${image.key}`} />
    ));
    return (
        <div>
            <h4>Image List</h4>
            {imgList}
        </div>
    );
};

export default ImageList;