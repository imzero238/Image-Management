const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

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

module.exports = { imageRouter };