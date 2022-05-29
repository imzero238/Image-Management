require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");

const app = express();
const { MONGO_URI, PORT } = process.env;
//console.log(process.env);

mongoose
.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB connected.")

    app.use("/uploads", express.static("uploads"));
    app.use("/images", imageRouter);
    app.listen(PORT, () => console.log("Express server listening on PORT" + PORT));
})
.catch((err) => console.log(err));