import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
    return (
        <Stack>
            {Array(20)
                .fill("")
                .map((_, i) => (
                    <Skeleton key={i} height="45px" width="100%" />
                ))}
        </Stack>
    );
};

export default ChatLoading;
