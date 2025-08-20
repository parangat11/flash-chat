import { Avatar, Box, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatContextProvider";

const UserListItem = ({ friend_user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#FFD700",
            }}
            w="100%"
            display="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={friend_user.name}
                src={friend_user.pic}
            />
            <Box>
                <Text>{friend_user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {friend_user.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
