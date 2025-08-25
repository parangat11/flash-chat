import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatContextProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleAdd = (userToAdd) => {
        let alreadyPresent = false;
        for (let idx = 0; idx < selectedUsers.length; idx++) {
            if (selectedUsers[idx]._id === userToAdd._id) {
                alreadyPresent = true;
                break;
            }
        }
        if (alreadyPresent) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult(null);
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const data = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setSearchResult(data.data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {};

    const handleDelete = (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter((user) => user._id !== userToDelete._id)
        );
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add users, e.g.: Radah, Godfrey, xyz, Sample"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box width="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    selected_user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        friend_user={user}
                                        handleFunction={() => handleAdd(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="yellow"
                            mr={3}
                            onClick={handleSubmit}
                        >
                            Create Group Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
