const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => { 
    const image = await new Image({ 
        key: req.file.filename, 
        originalFileName: req.file.originalname 
    }).save();
    console.log(req.file);
    res.json(image);
});
imageRouter.get("/", async (req, res) => {
    const images = await Image.find();
    res.json(images);
});

module.exports = { imageRouter };