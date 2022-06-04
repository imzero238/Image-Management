import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
    const [images, setImages] = useState([]);
    const [privateImages, setPrivateImages] = useState([]);
    const [me] = useContext(AuthContext);
    const [isPublic, setIsPublic] = useState(false);
    const [imageUrl, setImageUrl] = useState("/images");
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageLoading(true);
        axios
            .get(imageUrl)
            .then((result) => setImages((prevData) => [...prevData, ...result.data]))
            .catch((err) => {
                console.error(err);
                setImageError(err);
            })
            .finally(() => setImageLoading(false));
    }, [imageUrl]);

    useEffect(() => {
        if(me){
            setTimeout(() => {
                axios
                    .get("/users/me/images")
                    .then((result) => setPrivateImages(result.data))
                    .catch((err) => console.erroro(err))
            }, 0);
        } else {
            setPrivateImages([]);
            setIsPublic(true);
        }
    }, [me]);

    const loaderMoreImages = () => {
        if(images.length === 0 || imageLoading) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(`/images?lastid=${lastImageId}`);
    };

    return (
        <ImageContext.Provider value={{
            images, setImages, 
            privateImages, setPrivateImages,
            isPublic, setIsPublic,
            loaderMoreImages,
            imageLoading,
            imageError
            }}>
            {prop.children}
        </ImageContext.Provider>
    );
}