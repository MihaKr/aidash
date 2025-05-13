// app/context/TemperatureContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TemperatureContextType {
    temperature: number;
    setTemperature: (temp: number) => void;
    isLoading: boolean;
    lastUpdated: Date | null;
}

const TemperatureContext = createContext<TemperatureContextType>({
    temperature: 21,
    setTemperature: () => {},
    isLoading: false,
    lastUpdated: null
});

export const useTemperature = () => useContext(TemperatureContext);

export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
    const [temperature, setTemperatureState] = useState(21);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    // Fetch initial temperature on mount
    useEffect(() => {
        const fetchInitialTemperature = async () => {
            try {
                const response = await fetch('/api/alexa');
                const data = await response.json();
                if (data.temperature) {
                    setTemperatureState(data.temperature);
                }
            } catch (error) {
                console.error('Error fetching initial temperature:', error);
            }
        };

        fetchInitialTemperature();
        setMounted(true);

        // Set up polling for temperature updates
        const pollInterval = setInterval(checkForUpdates, 5000); // Poll every 5 seconds
        return () => clearInterval(pollInterval);
    }, []);

    // Check for temperature updates from Alexa
    const checkForUpdates = async () => {
        try {
            const response = await fetch('/api/alexa');
            const data = await response.json();

            if (data.temperature && data.temperature !== temperature) {
                console.log('Temperature updated from Alexa:', data.temperature);
                setTemperatureState(data.temperature);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error checking for temperature updates:', error);
        }
    };

    // Update temperature function
    const setTemperature = async (temp: number) => {
        setIsLoading(true);
        try {
            // Update Alexa API
            const response = await fetch('/api/alexa', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    temperature: temp,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update temperature');
            }

            // Update local state
            setTemperatureState(temp);
            setLastUpdated(new Date());
            console.log('Temperature updated successfully:', temp);
        } catch (error) {
            console.error('Error updating temperature:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TemperatureContext.Provider value={{
            temperature,
            setTemperature,
            isLoading,
            lastUpdated
        }}>
            {children}
        </TemperatureContext.Provider>
    );
};