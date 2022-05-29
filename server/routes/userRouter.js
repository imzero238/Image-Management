const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash } = require("bcryptjs");

userRouter.post("/register", async(req, res) => {
    const hashedPassword = await hash(req.body.password, 10);
    await new User({
        name: req.body.name,
        username: req.body.username,
        hashedPassword
    }).save();
    res.json({ message: "user registered" });
});

module.exports = { userRouter };
