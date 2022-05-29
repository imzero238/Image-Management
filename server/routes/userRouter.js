const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");

userRouter.post("/register", async(req, res) => {
    const user = await new User(req.body).save();
    res.json({ message: "user registered" });
});

module.exports = { userRouter };
