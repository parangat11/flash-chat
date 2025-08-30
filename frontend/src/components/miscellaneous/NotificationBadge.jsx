import { Box, Text } from "@chakra-ui/react";

const NotificationBadge = ({ count, children }) => (
    <Box position="relative" display="inline-block">
        {children}
        {count > 0 && (
            <Box
                position="absolute"
                top="-4px"
                right="-4px"
                bg="red.500"
                color="white"
                rounded="full"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
            >
                {count}
            </Box>
        )}
    </Box>
);

export default NotificationBadge;
