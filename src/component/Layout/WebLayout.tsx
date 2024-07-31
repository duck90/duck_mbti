"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";

import useUser from "@/hooks/useUser";

import Header from "./Header";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export function WebLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header user={user} />
      <Container maxWidth="xl" sx={{ minHeight: "calc(100vh - 64px)", pt: 8 }}>
        <main>{children}</main>
      </Container>
    </ThemeProvider>
  );
}
