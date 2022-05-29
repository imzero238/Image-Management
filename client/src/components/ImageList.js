import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
    const [images] = useContext(ImageContext);
    const imgList = images.map((image) => (
        <img 
            key={image.key} 
            style={{width:"33%"}} 
            src={`http://localhost:5050/uploads/${image.key}`} />
    ));
    return (
        <div>
            <h4>Image List</h4>
            {imgList}
        </div>
    );
};

export default ImageList;