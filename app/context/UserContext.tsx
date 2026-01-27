"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { useUser as useClerkUser } from "@clerk/nextjs";

type UserContextType = {
    isPremium: boolean;
    upgradeToPremium: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useClerkUser();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            // Check publicMetadata OR Admin Email for premium status
            const isAdmin = user.emailAddresses.some(e => e.emailAddress === "pdiazg46@gmail.com");
            const premiumStatus = user.publicMetadata?.isPremium === true || isAdmin;
            setIsPremium(premiumStatus);
        } else {
            setIsPremium(false);
        }
    }, [isLoaded, user]);

    const upgradeToPremium = () => {
        // This is now just a client-side temporary unlock for the session if needed, 
        // but real persistence comes from Clerk metadata.
        // For the "DEV Button" in modal, we can keep this state update.
        setIsPremium(true);
    };

    return (
        <UserContext.Provider value={{ isPremium, upgradeToPremium }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
