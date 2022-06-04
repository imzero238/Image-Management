import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
    const {images, privateImages, isPublic, setIsPublic, loaderMoreImages } = useContext(ImageContext);
    const [me] = useContext(AuthContext);

    const imgList = (isPublic ? images : privateImages).map((image) => (
        <Link key={image.key} to={`/images/${image._id}`}>
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
            <button onClick={loaderMoreImages} style={{width: 170, fontSize: 17, marginTop: 10}}>Load More Images</button>
        </div>
    );
};

export default ImageList;