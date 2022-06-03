import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImagePage = () => {
    const { imageId } = useParams();
    const { images, privateImages, setImages, setPrivateImages } = useContext(ImageContext); 
    const [me] = useContext(AuthContext);
    const [ hasLiked, setHasLiked ] = useState(false);
    const navigate = useNavigate();
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
    
    const deleteHandler = async () => {
        try {
            if(!window.confirm("해당 이미지를 삭제하시겠습니까?")) return;
            const result = await axios.delete(`/images/${imageId}`);
            toast.success(result.data.message);
            setImages(images.filter((image) => image._id !== imageId));
            setPrivateImages(privateImages.filter((image) => image._id !== imageId));
            navigate("/");
        } catch(err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <img 
                className="image" 
                alt={imageId} src={`http://localhost:5050/uploads/${image.key}`}
            />
            <button onClick={onSubmit} style={{marginTop: 10, marginBottom: 5}}>{hasLiked ? "unlike" : "like"}</button>
            {me && image.user._id === me.userId && (
                <button 
                    style={{float: "right", marginLeft: 10}}
                    onClick={deleteHandler}>
                    delete
                </button>
            )}
            <br/>
            <span>{image.likes.length} likes</span>
        </div>
    );
};

export default ImagePage;