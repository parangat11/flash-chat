import React, { useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
    const fetchChats = async () => {
        console.log("reached");
        const data = await axios.get("/api/chat");
        console.log(data);
    };
    useEffect(() => {
        fetchChats();
    }, []);
    return <div>dsfkl</div>;
};

export default ChatPage;
