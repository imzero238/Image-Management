import React, { createContext, useEffect, useState, useContext, useCallback } from "react";
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

    const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;

    const loaderMoreImages = useCallback(() => {
        if(imageLoading || !lastImageId) return;
        setImageUrl(`/images?lastid=${lastImageId}`);
    }, [lastImageId, imageLoading]);

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