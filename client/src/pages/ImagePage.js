import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ImagePage = () => {
    const { imageId } = useParams();
    const { images, privateImages, setImages, setPrivateImages } = useContext(ImageContext); 
    const [me] = useContext(AuthContext);
    const [ hasLiked, setHasLiked ] = useState(false);
    const image = images.find((image) => image._id === imageId) ||
                    privateImages.find((image) => image._id === imageId);
    
    useEffect(() => {
        if(me && image && image.likes.includes(me.userId)) setHasLiked(true);
    }, [me, image]);

    if(!image) 
        return <h3>Loading...</h3>

    const updateImage = (images, image) => [
        ...images.filter((image) => image._id !== imageId),
        image,
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const onSubmit = async () => {
        const result = await axios.patch(`/images/${imageId}/${hasLiked?"unlike":"like"}`);
        if(result.data.public)
            setImages(updateImage(images, result.data));
        else 
            setPrivateImages(updateImage(privateImages, result.data));
        setHasLiked(!hasLiked);
    }

    return (
        <div>
            <img 
                className="image" 
                alt={imageId} src={`http://localhost:5050/uploads/${image.key}`}
            />
            <button onClick={onSubmit} style={{marginTop: 10, marginBottom: 5}}>{hasLiked ? "unlike" : "like"}</button>
            <br/>
            <span>{image.likes.length} likes</span>
        </div>
    );
};

export default ImagePage;