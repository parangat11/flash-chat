import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/ChatContextProvider";
import {
    Avatar,
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    getSender,
    getSenderFull,
    isLastMessageOfOther,
    isOtherSenderLastInBlock,
    isOtherSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import io from "socket.io-client";

const BACKEND_ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const toast = useToast();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        socket = io(BACKEND_ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, []);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(
                `api/message/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to send message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error Occured!",
                    description: "Failed to send message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessage.chat._id
            ) {
                // give notification
            } else {
                setMessages([...messages, newMessage]);
            }
        });
    });

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        ></IconButton>
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(
                                        user,
                                        selectedChat.users
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                {messages &&
                                    messages.map((message, idx) => {
                                        return (
                                            <div
                                                className="message"
                                                key={idx}
                                                style={{ display: "flex" }}
                                            >
                                                {(isOtherSenderLastInBlock(
                                                    messages,
                                                    message,
                                                    idx,
                                                    user._id
                                                ) ||
                                                    isLastMessageOfOther(
                                                        messages,
                                                        idx,
                                                        user._id
                                                    )) && (
                                                    <Tooltip
                                                        label={
                                                            message.sender.name
                                                        }
                                                        placement="bottom-start"
                                                        hasArrow
                                                    >
                                                        <Avatar
                                                            mt="7px"
                                                            mr={1}
                                                            size="sm"
                                                            cursor="pointer"
                                                            name={
                                                                message.sender
                                                                    .name
                                                            }
                                                            src={
                                                                message.sender
                                                                    .pic
                                                            }
                                                        />
                                                    </Tooltip>
                                                )}
                                                <span
                                                    style={{
                                                        backgroundColor: `${
                                                            message.sender
                                                                ._id ===
                                                            user._id
                                                                ? "#BEE3F8"
                                                                : "#FFD700"
                                                        }`,
                                                        borderRadius: "20px",
                                                        padding: "5px 15px",
                                                        maxWidth: "75%",
                                                        marginLeft:
                                                            isOtherSenderMargin(
                                                                messages,
                                                                message,
                                                                idx,
                                                                user._id
                                                            ),
                                                        marginTop: isSameUser(
                                                            messages,
                                                            message,
                                                            idx
                                                        )
                                                            ? 3
                                                            : 10,
                                                    }}
                                                >
                                                    {message.content}
                                                </span>
                                            </div>
                                        );
                                    })}
                                <div ref={bottomRef} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
