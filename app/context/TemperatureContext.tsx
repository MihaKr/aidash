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

    // Initialize from localStorage on client side
    useEffect(() => {
        setMounted(true);
        const storedTemp = localStorage.getItem('temperature');
        if (storedTemp) {
            setTemperatureState(Number(storedTemp));
        }

        // Poll for temperature updates every 30 seconds
        const pollInterval = setInterval(checkForUpdates, 30000);
        return () => clearInterval(pollInterval);
    }, []);

    // Check for temperature updates from Alexa
    const checkForUpdates = async () => {
        try {
            const response = await fetch('/api/alexa');
            const data = await response.json();

            if (data.temperature && data.temperature !== temperature) {
                setTemperatureState(data.temperature);
                setLastUpdated(new Date());
                localStorage.setItem('temperature', data.temperature.toString());
            }
        } catch (error) {
            console.error('Error checking for temperature updates:', error);
        }
    };

    // Update temperature both locally and on the server
    const setTemperature = async (temp: number) => {
        setIsLoading(true);
        try {
            // Update local state immediately for responsive UI
            setTemperatureState(temp);
            localStorage.setItem('temperature', temp.toString());

            // Update server
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

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error updating temperature:', error);
            // Revert on failure
            const storedTemp = localStorage.getItem('temperature');
            if (storedTemp) {
                setTemperatureState(Number(storedTemp));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = {
        temperature,
        setTemperature,
        isLoading,
        lastUpdated
    };

    return (
        <TemperatureContext.Provider value={contextValue}>
            {children}
        </TemperatureContext.Provider>
    );
};