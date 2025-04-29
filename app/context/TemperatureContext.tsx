// context/TemperatureContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface TemperatureContextType {
    temperature: number;
    setTemperature: (temp: number) => void;
}

// Create the context with default values
const TemperatureContext = createContext<TemperatureContextType>({
    temperature: 21,
    setTemperature: () => {},
});

// Custom hook to use the temperature context
export const useTemperature = () => useContext(TemperatureContext);

// Provider component
export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
    // Use localStorage to persist temperature across pages
    const [temperature, setTemperatureState] = useState(21);
    const [mounted, setMounted] = useState(false);

    // Initialize from localStorage on client side only
    useEffect(() => {
        setMounted(true);
        const storedTemp = localStorage.getItem('temperature');
        if (storedTemp) {
            setTemperatureState(Number(storedTemp));
        }
    }, []);

    // Update localStorage when temperature changes
    const setTemperature = (temp: number) => {
        setTemperatureState(temp);
        if (typeof window !== 'undefined') {
            localStorage.setItem('temperature', temp.toString());
        }
    };

    // Only provide the context value when the component is mounted (client-side)
    // This prevents hydration mismatches
    const contextValue = {
        temperature,
        setTemperature
    };

    return (
        <TemperatureContext.Provider value={contextValue}>
            {children}
        </TemperatureContext.Provider>
    );
};