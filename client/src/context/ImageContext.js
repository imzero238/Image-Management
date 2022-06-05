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
            .then((result) => 
                isPublic 
                    ? setImages((prevData) => [...prevData, ...result.data]) 
                    : setPrivateImages((prevData) => [...prevData, ...result.data])
            )
            .catch((err) => {
                console.error(err);
                setImageError(err);
            })
            .finally(() => setImageLoading(false));
    }, [imageUrl, isPublic]);

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

    return (
        <ImageContext.Provider value={{
            images: isPublic ? images : privateImages,
            setImages: isPublic ? setImages : setPrivateImages,
            isPublic, setIsPublic,
            setImageUrl,
            imageLoading,
            imageError
            }}>
            {prop.children}
        </ImageContext.Provider>
    );
}