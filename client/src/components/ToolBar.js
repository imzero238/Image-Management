import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ToolBar = () => {
    const [me, setMe] = useContext(AuthContext);

    const logoutHandler = async () => {
        try {
            await axios.patch("/users/logout");
            setMe();
            toast.success("log-out success!");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            {me ? (
                <span onClick={logoutHandler} style={{ float: "right" }}>log out ({me.name})</span>
            ) : (
                <>
                    <Link to="/auth/login">
                        <span style={{ float: "right" }}>login</span>
                    </Link> 
                    <Link to="/auth/signup">
                        <span style={{ float: "right", marginRight: 15 }}>sign up</span>
                    </Link>
                </>
            )}
        </div>
    );
};

export default ToolBar;