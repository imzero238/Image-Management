import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [me, setMe] = useState();

    useEffect(() => {
        if(me) axios.defaults.headers.common.sessionid = me.sessionId;
        else delete axios.defaults.headers.common.sessionid;
    }, [me]);

    return (
        <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
    );
};