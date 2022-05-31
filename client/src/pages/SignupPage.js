import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [me, setMe] = useContext(AuthContext);

    const submitHandler = async(e) => {
        try {
            e.preventDefault();
            if(username.length < 3)
                throw new Error("username은 3자 이상만 입력 가능합니다.");
            if(password.length < 6)
                throw new Error("password는 6자 이상만 입력 가능합니다.");
            if(password !== passwordCheck)
                throw new Error("비밀번호가 일치하지 않습니다.");

            const result = await axios.post("/users/signup", { name, username, password });
            setMe({
                userId: result.data.userId,
                sessionId: result.data.sessionId,
                name: result.data.name
            });
            toast.success("Signup success!");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    return (
        <div 
            style={{
                marginTop: 100,
                maxWidth: 350,
                marginLeft: "auto",
                marginRight: "auto"
            }}
        >
            <form onSubmit={submitHandler}>
                <CustomInput label="name" value={name} setValue={setName} />
                <CustomInput label="username" value={username} setValue={setUsername} />
                <CustomInput label="password" value={password} setValue={setPassword} type="password" />
                <CustomInput label="password check" value={passwordCheck} setValue={setPasswordCheck} type="password" />
    
                <button type="submit" style={{ marginTop: 10 }}>submit</button>
            </form>
        </div>
    );
};

export default SignupPage;