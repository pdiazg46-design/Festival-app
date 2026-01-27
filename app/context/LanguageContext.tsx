"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, type Dictionary } from "../lib/dictionaries";

type Language = "en" | "es";

interface LanguageContextType {
    language: Language;
    t: Dictionary;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLanguage = localStorage.getItem("language") as Language;
        if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
            setLanguage(savedLanguage);
        }
    }, []);

    const toggleLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const value = {
        language,
        t: dictionaries[language],
        setLanguage: toggleLanguage,
    };

    if (!mounted) {
        return (
            <LanguageContext.Provider value={value}>
                <div className="invisible">{children}</div>
            </LanguageContext.Provider>
        ); // Avoid hydration mismatch by rendering nothing or a loader until mounted
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
