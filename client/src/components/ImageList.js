import React, { useContext, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
    const {images, isPublic, setIsPublic, imageLoading, imageError, setImageUrl, lastImageId } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const elementRef = useRef(null); 

    const loaderMoreImages = useCallback(() => {
        if(images.length === 0 || imageLoading) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(`${isPublic ? "" : "/users/me"}/images?lastid=${lastImageId}`);
    }, [lastImageId, imageLoading, isPublic, setImageUrl]);

    useEffect(() => {
        if(!elementRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            console.log("intersection ", entry.isIntersecting);
            if(entry.isIntersecting) loaderMoreImages();
        });
        observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [loaderMoreImages]);

    const imgList = images.map((image, index) => (
        <Link 
            key={image.key} 
            to={`/images/${image._id}`}
            ref={index + 1 === images.length ? elementRef : undefined}
        >
            <img alt="" src={`http://localhost:5050/uploads/${image.key}`} />
        </Link>
    ));

    return (
        <div>
            <h4 style={{ display: "inline-block", marginRight: 10 }}>Image List</h4>
            {me && <button onClick={() => setIsPublic(!isPublic)}>
                {(isPublic ? "비공개 사진 보기" : "공개 사진 보기")}
            </button>}
            <br/>
            <div className="image-list-container">{imgList}</div>
            {imageError && <div>Error</div>}
            {imageLoading && <div>Loading...</div>}
        </div>
    );
};

export default ImageList;