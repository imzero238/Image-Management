import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
    const [me, setMe] = useContext(AuthContext);

    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            {me ? (
                <span style={{ float: "right" }}>log out</span>
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