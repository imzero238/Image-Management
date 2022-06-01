const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/signup", async(req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10);
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword,
            sessions: [{ createdAt: new Date() }]
        }).save();
        const session = user.sessions[0];
        res.json({ 
            message: "user registered",
            sessionId: session._id,
            name: user.name
        });
    } catch (err) {
        if(err.name == "MongoServerError") 
            res.status(400).json({ message: "이미 존재하는 username 입니다." });
        else 
            res.status(400).json({ message: err.message });
    }
});

userRouter.patch("/login", async (req, res) => {
    try{
        const user = await User.findOne({ username: req.body.username });
        if(!user)
            throw new Error("존재하는 username이 없습니다.");
        const isValid = await compare(req.body.password, user.hashedPassword);
        if(!isValid)
            throw new Error("잘못된 비밀번호 입니다.");
        user.sessions.push({ createdAt: new Date() });
        const session = user.sessions[user.sessions.length - 1];
        await user.save();
        res.json({ 
            message: "login success",
            sessionId: session._id,
            name: user.name
        });
    } catch (err) {
        console.log( err.message );
        res.status(400).json({ message: err.message });
    }
});

userRouter.patch("/logout", async (req, res)=> {
    try {
        if(!req.user) 
            throw new Error("invalid sessionid");
        await User.updateOne(
            { _id: req.user.id },
            { $pull: { sessions: { _id: req.headers.sessionid } } }
        );
        res.json({ message: "log-out" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.get("/me", (req, res) => {
    try {
        if(!req.user)
            throw new Error("접근권한이 없습니다.");
        res.json({
            message: "successful access",
            sessionId: req.headers.sessionid,
            name: req.user.name,
            userId: req.user._id
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = { userRouter };
