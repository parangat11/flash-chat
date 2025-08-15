import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@chakra-ui/react/preset";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <ChakraProvider value={system}>
                <App />
            </ChakraProvider>
        </BrowserRouter>
    </StrictMode>
);
