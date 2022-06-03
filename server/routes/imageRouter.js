const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

imageRouter.post("/", upload.single("image"), async (req, res) => { 
    try{
        if(!req.user)
            throw new Error("접근 권한이 없습니다.");
        const image = await new Image({ 
            user: {
                _id: req.user.id,
                name: req.user.name,
                username: req.user.username
            },
            public: req.body.public,
            key: req.file.filename, 
            originalFileName: req.file.originalname 
        }).save();
        console.log(req.file);
        res.json(image);   
    }catch(err){
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

imageRouter.get("/", async (req, res) => {
    const images = await Image.find({ public: true });
    res.json(images);
});

imageRouter.delete("/:imageId", async (req, res) => {
    try{
        if(!req.user)
            throw new Error("권한이 없습니다.");
        if(!mongoose.isValidObjectId(req.params.imageId))
            throw new Error("올바르지 않는 이미지입니다.");

        const image = await Image.findOneAndDelete({ _id: req.params.imageId });
        if(!image)
            return res.json({ message: "요청하신 이미지는 이미 삭제되었습니다."});
        await fileUnlink(`./uploads/${image.key}`);
        res.json({ message: "이미지가 삭제되었습니다. "});
    } catch(err){
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = { imageRouter };