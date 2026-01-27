"use client";

import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </UserProvider>
    );
}
