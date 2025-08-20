import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ChatContextProvider from "./Context/ChatContextProvider.jsx";

const theme = extendTheme({});

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ChatContextProvider>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </ChatContextProvider>
    </BrowserRouter>
);
