import React from "react";
import { Link } from "react-router-dom";

const ToolBar = () => {
    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            <Link to="/auth/login">
                <span style={{ float: "right" }}>login</span>
            </Link> 
            <Link to="/auth/signup">
                <span style={{ float: "right", marginRight: 15 }}>sign up</span>
            </Link>
        </div>
    );
};

export default ToolBar;