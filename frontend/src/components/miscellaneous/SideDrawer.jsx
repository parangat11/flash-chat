import {
    Button,
    Tooltip,
    Box,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
    Flex,
    MenuDivider,
    Drawer,
    useDisclosure,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatContextProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    const toast = useToast();

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id))
                setChats([...data, chats]);
            setSelectedChat(data);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        } finally {
            setLoadingChat(false);
        }
    };
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `/api/user?search=${search}`,
                config
            );
            setSearchResult(data);
            console.log(searchResult);
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                // opacity="0.75"
                borderWidth={"5px"}
            >
                <Tooltip
                    label="Search user to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={"2xl"} fontFamily={"Work sans"} opacity="100%">
                    ⚡Flash Chat⚡
                </Text>

                <div>
                    <Flex align="center" justifyContent="center" bg="gray.100">
                        <Menu>
                            <MenuButton p={1}>
                                <BellIcon fontSize={"2xl"} m={1} />
                            </MenuButton>
                            {/* <MenuList></MenuList> */}
                        </Menu>
                        <Menu>
                            <MenuButton as={Button}>
                                <Avatar
                                    size="sm"
                                    cursor="pointer"
                                    name={user.name}
                                    src={user.pic}
                                />
                            </MenuButton>
                            <MenuList>
                                <ProfileModal user={user}>
                                    <MenuItem>View Profile</MenuItem>
                                </ProfileModal>
                                <MenuDivider />
                                <MenuItem onClick={logoutHandler}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>
                        Search Users
                    </DrawerHeader>
                    <DrawerBody pb={2}>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((friend_user) => {
                                return (
                                    <UserListItem
                                        key={friend_user._id}
                                        friend_user={friend_user}
                                        handleFunction={() =>
                                            accessChat(friend_user._id)
                                        }
                                    />
                                );
                            })
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
