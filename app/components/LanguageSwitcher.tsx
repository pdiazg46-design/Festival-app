"use client";

import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-full text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
            <Globe size={16} />
            <span>{language === "en" ? "ES" : "EN"}</span>
        </button>
    );
}
