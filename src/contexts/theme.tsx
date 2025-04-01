"use client";

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { PropsWithChildren } from "react";
import theme from "@/theme";

export default function ThemeProvider({ children }: PropsWithChildren) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}
