import React from "react";
import {
    Container,
    Box,
    Text,
    Tabs,
    TabPanel,
    TabList,
    TabPanels,
    Tab,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg="white"
                width="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                opacity="0.7"
            >
                <Text fontSize="4xl" fontFamily="Work Sans">
                    Flash Chat
                </Text>
            </Box>
            <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                opacity="0.85"
            >
                <Tabs variant="soft-rounded" colorScheme="yellow">
                    <TabList mb="1em">
                        <Tab width="50%">Tab 1</Tab>
                        <Tab width="50%">Tab 2</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default Homepage;
