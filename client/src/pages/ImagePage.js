import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImagePage = () => {
    const { imageId } = useParams();
    const { images, setImages, setPrivateImages } = useContext(ImageContext); 
    const [me] = useContext(AuthContext);
    const [ hasLiked, setHasLiked ] = useState(false);
    const [image, setImage] = useState();
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const img = images.find((image) => image._id === imageId);
        if(img) setImage(img);
    }, [images, imageId]);

    useEffect(() => {
        if(image && image._id === imageId) return; 
        axios
            .get(`/images/${imageId}`)
            .then(({data}) => {
                setError(false);
                setImage(data)
            })
            .catch((err) => {
                setError(true);
                toast.error(err.response.data.message)
            });
    }, [image, imageId]);

    useEffect(() => {
        if(me && image && image.likes.includes(me.userId)) setHasLiked(true);
    }, [me, image]);

    if(error) return <h3>Error...</h3>
    if(!image) return <h3>Loading...</h3>

    const updateImage = (images, image) => [
        ...images.filter((image) => image._id !== imageId),
        image,
    ].sort((a, b) => {
        if(a._id < b._id) return 1;
        else return -1;
    });
    
    const onSubmit = async () => {
        const result = await axios.patch(`/images/${imageId}/${hasLiked?"unlike":"like"}`);
        if(result.data.public)
            setImages((prevData) => updateImage(prevData, result.data));
        setPrivateImages((prevData) => updateImage(prevData, result.data));
        setHasLiked(!hasLiked);
    }
    
    const deleteHandler = async () => {
        try {
            if(!window.confirm("해당 이미지를 삭제하시겠습니까?")) return;
            const result = await axios.delete(`/images/${imageId}`);
            toast.success(result.data.message);
            setImages((prevData) => prevData.filter((image) => image._id !== imageId));
            setPrivateImages((prevData) => prevData.filter((image) => image._id !== imageId));
            navigate("/");
        } catch(err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <img 
                className="image" 
                alt={imageId} src={`https://image-upload-management.s3.ap-northeast-2.amazonaws.com/w600/${image.key}`}
            />
            <button className="button" onClick={onSubmit} style={{marginTop: 10, marginBottom: 5}}>{hasLiked ? "unlike" : "like"}</button>
            {me && image.user._id === me.userId && (
                <button className="button"
                    style={{float: "right", marginLeft: 10}}
                    onClick={deleteHandler}>
                    delete
                </button>
            )}
            <br/>
            <span style={{fontSize: 25, marginLeft: 13}}>{image.likes.length} likes</span>
        </div>
    );
};

export default ImagePage;