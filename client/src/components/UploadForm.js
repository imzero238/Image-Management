import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
    const {setImages, setPrivateImages} = useContext(ImageContext);
    const [files, setFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [percent, setPercent] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const inputRef = useRef();
     
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
        try{
            const presignedData = await axios.post("/images/presigned", {
                contentTypes: [...files].map((file) => file.type)
            });

            await Promise.all(
                [...files].map((file, index) => {
                    const { presigned } = presignedData.data[index];
                    const formData = new FormData();
                    for(const key in presigned.fields) {
                        formData.append(key, presigned.fields[key]);
                    }
                    formData.append("Content-Type", file.type);
                    formData.append("file", file);
                    return axios.post(presigned.url, formData, {
                        onUploadProgress: (e) => {
                            setPercent((prevData) => {
                                const newData = [...prevData];
                                newData[index] = Math.round((100 * e.loaded) / e.total);
                                return newData;
                            });
                        }
                    });
                })
            );

            const res = await axios.post("/images", {
                images: [...files].map((file, index) => ({
                    imageKey: presignedData.data[index].imageKey,
                    originalname: file.name,
                })),
                public: isPublic,
            });

            if(isPublic) setImages((prevData) => [...res.data, ...prevData]);
            setPrivateImages((prevData) => [...res.data, ...prevData])

            toast.success("이미지 업로드 성공!");
            setTimeout(() => {
                setPercent([]);
                setPreviews([]);
                inputRef.current.value = null;
            }, 3000);
        } catch (err) {
            toast.error(err.message.data.message);
            setPercent([]);
            setPreviews([]);
            inputRef.current.value = null;
            console.error(err);
        }
    };

    const previewImages = previews.map((preview, index) => (
        <div key={index}>
            <img 
                src={preview.imgSrc} 
                className="image-preview"
                style={{ width: 140, height: 140, objectFit: "cover" }}
                alt=""
            />
            <ProgressBar percent ={percent[index]} />
        </div>
    ));

    const fileName = previews.length === 0 ? "이미지 파일을 업로드 해주세요." : 
                previews.reduce((previous, current) => previous + `${current.fileName},  `, "");

    return  (
        <form onSubmit={onSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>{previewImages}</div>
            <div className="file-dropper">
            {fileName}
            <input 
                id="image" type="file" 
                ref={(ref) => (inputRef.current = ref)}
                multiple accept="image/*" onChange = {imageSelectHandler}
            />
            </div>
            <input type="checkBox" id="public-check" style={{marginBottom: 15}}
                value={!isPublic} onChange={() => setIsPublic(!isPublic)}/>
            <label htmlFor="public-check">비공개</label>
            <button type="submit" style={{width: "100%", height: 27, borderRadius: 3, cursor: "pointer"}}>제출</button>
        </form>
    );
};

export default UploadForm;