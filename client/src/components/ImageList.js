import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
    const {images, privateImages, isPublic, setIsPublic } = useContext(ImageContext);
    const [me] = useContext(AuthContext);

    const imgList = (isPublic ? images : privateImages).map((image) => (
        <img 
            alt=""
            key={image.key} 
            style={{width:"33%"}} 
            src={`http://localhost:5050/uploads/${image.key}`} />
    ));
    return (
        <div>
            <h4 style={{ display: "inline-block", marginRight: 10 }}>Image List</h4>
            {me && <button onClick={() => setIsPublic(!isPublic)}>
                {(isPublic ? "비공개 사진 보기" : "공개 사진 보기")}
            </button>}
            <br/>
            {imgList}
        </div>
    );
};

export default ImageList;