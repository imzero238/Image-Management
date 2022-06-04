import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
    const {images, setImages, privateImages, setPrivateImages} = useContext(ImageContext);
    const defaultFileName = "이미지 파일을 업로드 해주세요";
    const [file, setFile] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [fileName, setFileName] = useState(defaultFileName);
    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);
     
    const imageSelectHandler = (event) => {
        const imageFile = event.target.files[0];
        setFile(imageFile);
        setFileName(imageFile.name);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile);
        fileReader.onload = (e) => setImgSrc(e.target.result);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        formData.append("public", isPublic);
        try {
            const res = await axios.post("/images", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
            if(isPublic) 
                setImages([...images, res.data]);
            else 
                setPrivateImages([...privateImages, res.data]);
            toast.success("이미지 업로드 성공!");
            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFileName);
                setImgSrc(null);
            }, 3000);
        } catch (err) {
            toast.error(err.message.data.message);
            setPercent(0);
            setFileName(defaultFileName);
            setImgSrc(null);
            console.error(err);
        }
    };

    return  (
        <form onSubmit={onSubmit}>
            <img src={imgSrc} className="image-preview" alt="" />
            <ProgressBar percent ={percent} />
            <div className="file-dropper">
            {fileName}
            <input id="image" type="file" accept="image/*" onChange = {imageSelectHandler}/>
            </div>
            <input type="checkBox" id="public-check" style={{marginBottom: 15}}
                value={!isPublic} onChange={() => setIsPublic(!isPublic)}/>
            <label htmlFor="public-check">비공개</label>
            <button type="submit" style={{width: "100%", height: 27, borderRadius: 3, cursor: "pointer"}}>제출</button>
        </form>
    );
};

export default UploadForm;