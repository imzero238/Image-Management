import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";

const ImagePage = () => {
    const { imageId } = useParams();
    const { images, privateImages } = useContext(ImageContext); 
    const image = images.find((image) => image._id === imageId) ||
                    privateImages.find((image) => image._id === imageId);
    if(!image) 
        return <h3>Loading...</h3>
    return (
        <div>
            <img className="image" 
                alt={imageId} src={`http://localhost:5050/uploads/${image.key}`}
            />
        </div>
    );
};

export default ImagePage;