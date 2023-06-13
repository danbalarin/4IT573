import { extendTheme, baseTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    initialColorMode: "system",
    useSystemColorMode: false,
    colors: {
        primary: baseTheme.colors.blue,
    }
})