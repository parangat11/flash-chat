import {
    FormControl,
    FormLabel,
    VStack,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleClick = () => setShowPassword(!showPassword);
    const handleConfirmClick = () =>
        setShowConfirmPassword(!showConfirmPassword);
    const postDetails = async (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please select an image!.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            try {
                const res = await fetch("/api/get-signature", {
                    method: "GET",
                });
                const data = new FormData();
                data.append("file", pic);
                data.append("upload_preset", "flash-chat-app");
                data.append("cloud_name", "dd047rxqq");
                fetch(
                    "https://api.cloudinary.com/v1_1/dd047rxqq/image/upload",
                    {
                        method: "post",
                        body: data,
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        setPic(data.url.toString());
                        console.log(data.url.toString());
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                    });
            } catch (err) {}
        } else {
            toast({
                title: "Please select an image!.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    const submitHandler = () => {};

    return (
        <VStack spacing="5px">
            <FormControl isRequired id="first-name">
                <FormLabel>Name:</FormLabel>
                <Input
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email:</FormLabel>
                <Input
                    placeholder="Enter your e-mail"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password:</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password:</FormLabel>
                <InputGroup>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleConfirmClick}
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload your picture:</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                ></Input>
            </FormControl>

            <Button
                colorScheme="yellow"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
