import React from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import theme from "./theme";
import Quiz from "./components/Quiz";
import questions from "./data/questions";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

const LanguageToggle = () => {
  const { toggleLanguage, language } = useLanguage();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1200,
      }}
    >
      <Tooltip
        title={
          language === "uk" ? "Switch to English" : "Перейти на українську"
        }
      >
        <IconButton
          onClick={toggleLanguage}
          sx={{
            bgcolor: "background.paper",
            boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}20`,
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <LanguageIcon sx={{ color: (theme) => theme.palette.primary.main }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const AppContent = () => {
  return (
    <>
      <LanguageToggle />
      <Quiz questions={questions} />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
