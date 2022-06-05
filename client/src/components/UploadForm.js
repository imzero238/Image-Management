import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
    const {setImages, setPrivateImages} = useContext(ImageContext);
    const [files, setFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);
     
    const imageSelectHandler = async (event) => {
        const imageFiles = event.target.files;
        setFiles(imageFiles);

        const imagePreviews = await Promise.all(
            [...imageFiles].map(async (imageFile) => {
                return new Promise((resolve, reject) => {
                    try{
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(imageFile);
                        fileReader.onload = (e) => resolve({ imgSrc: e.target.result, fileName: imageFile.name });
                    } catch(err){
                        reject(err);
                    }
                })
            })
        );
        setPreviews(imagePreviews);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for(let file of files)
            formData.append("image", file);
        formData.append("public", isPublic);
        try {
            const res = await axios.post("/images", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
            if(isPublic) setImages((prevData) => [...res.data, ...prevData]);
            setPrivateImages((prevData) => [...res.data, ...prevData])
            toast.success("이미지 업로드 성공!");
            setTimeout(() => {
                setPercent(0);
                setPreviews([]);
            }, 3000);
        } catch (err) {
            toast.error(err.message.data.message);
            setPercent(0);
            setPreviews([]);
            console.error(err);
        }
    };

    const previewImages = previews.map((preview, index) => (
        <img 
            key={index}
            style={{ width: 140, height: 140, objectFit: "cover" }}
            src={preview.imgSrc} 
            className="image-preview"
            alt="" />
    ));

    const fileName = previews.length === 0 ? "이미지 파일을 업로드 해주세요." : 
                previews.reduce((previous, current) => previous + `${current.fileName},  `, "");

    return  (
        <form onSubmit={onSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
            <ProgressBar percent ={percent} />
            <div className="file-dropper">
            {fileName}
            <input id="image" type="file" multiple accept="image/*" onChange = {imageSelectHandler}/>
            </div>
            <input type="checkBox" id="public-check" style={{marginBottom: 15}}
                value={!isPublic} onChange={() => setIsPublic(!isPublic)}/>
            <label htmlFor="public-check">비공개</label>
            <button type="submit" style={{width: "100%", height: 27, borderRadius: 3, cursor: "pointer"}}>제출</button>
        </form>
    );
};

export default UploadForm;