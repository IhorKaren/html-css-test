import React, { createContext, useState, useContext } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("uk");
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "uk" ? "en" : "uk"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
