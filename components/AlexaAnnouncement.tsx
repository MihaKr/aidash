// components/AlexaAnnouncement.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface Announcement {
    id: number;
    message: string;
    impactType: 'weather' | 'time' | 'energy' | 'temperature';
    impactDescription: string;
}

const announcements: Announcement[] = [
    {
        id: 1,
        message: "The weather outside is now cloudy. Your solar panels are producing less electricity.",
        impactType: 'weather',
        impactDescription: 'Consider reducing your electricity usage temporarily.'
    },
    {
        id: 2,
        message: "It's now raining outside. Temperatures will drop over the next hour.",
        impactType: 'weather',
        impactDescription: 'Your heating system may need to work harder soon.'
    },
    {
        id: 3,
        message: "The time is now 17:00. You're entering peak energy cost hours.",
        impactType: 'time',
        impactDescription: 'Electricity costs more during this time period.'
    },
    {
        id: 4,
        message: "Your neighborhood is experiencing high energy usage. Grid is under strain.",
        impactType: 'energy',
        impactDescription: 'Consider reducing non-essential electricity usage.'
    },
    {
        id: 5,
        message: "Outside temperature has dropped to 5°C. Insulation effectiveness decreases.",
        impactType: 'temperature',
        impactDescription: 'Your heating system will work harder to maintain temperature.'
    }
];

interface AlexaAnnouncementProps {
    initialDelay?: number; // Initial delay before first announcement (ms)
    intervalMin?: number;  // Minimum time between announcements (ms)
    intervalMax?: number;  // Maximum time between announcements (ms)
    enabled?: boolean;     // Whether announcements are enabled
    onAnnouncement?: (announcement: Announcement) => void; // Callback when announcement happens
}

const AlexaAnnouncement: React.FC<AlexaAnnouncementProps> = ({
                                                                 initialDelay = 30000, // 30 seconds default
                                                                 intervalMin = 60000,  // 1 minute minimum
                                                                 intervalMax = 180000, // 3 minutes maximum
                                                                 enabled = true,
                                                                 onAnnouncement
                                                             }) => {
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
    const [nextAnnouncementTime, setNextAnnouncementTime] = useState<number | null>(null);

    // Function to get a random announcement
    const getRandomAnnouncement = (): Announcement => {
        const randomIndex = Math.floor(Math.random() * announcements.length);
        return announcements[randomIndex];
    };

    // Function to calculate next interval
    const getNextInterval = (): number => {
        return Math.floor(Math.random() * (intervalMax - intervalMin + 1)) + intervalMin;
    };

    // Effect to handle the announcement timer
    useEffect(() => {
        if (!enabled) return;

        // Set the initial timer
        const initialTimer = setTimeout(() => {
            const announcement = getRandomAnnouncement();
            setCurrentAnnouncement(announcement);
            setShowAnnouncement(true);

            if (onAnnouncement) {
                onAnnouncement(announcement);
            }

            // Calculate when the next announcement will be
            const nextInterval = getNextInterval();
            setNextAnnouncementTime(Date.now() + nextInterval);

        }, initialDelay);

        return () => clearTimeout(initialTimer);
    }, [enabled, initialDelay, onAnnouncement]);

    // Effect to set up recurring announcements
    useEffect(() => {
        if (!enabled || !nextAnnouncementTime) return;

        // Calculate time to next announcement
        const timeToNext = nextAnnouncementTime - Date.now();

        if (timeToNext <= 0) return;

        const timer = setTimeout(() => {
            const announcement = getRandomAnnouncement();
            setCurrentAnnouncement(announcement);
            setShowAnnouncement(true);

            if (onAnnouncement) {
                onAnnouncement(announcement);
            }

            // Calculate when the next announcement will be
            const nextInterval = getNextInterval();
            setNextAnnouncementTime(Date.now() + nextInterval);

        }, timeToNext);

        return () => clearTimeout(timer);
    }, [enabled, nextAnnouncementTime, onAnnouncement]);

    // Effect to hide the announcement after a delay
    useEffect(() => {
        if (!showAnnouncement) return;

        const timer = setTimeout(() => {
            setShowAnnouncement(false);
        }, 10000); // Hide after 10 seconds

        return () => clearTimeout(timer);
    }, [showAnnouncement]);

    // If there's no announcement or it shouldn't be shown, render nothing
    if (!showAnnouncement || !currentAnnouncement) {
        return null;
    }

    // Icons for different impact types
    const getImpactIcon = (type: string) => {
        switch (type) {
            case 'weather':
                return '☁️';
            case 'time':
                return '⏰';
            case 'energy':
                return '⚡';
            case 'temperature':
                return '🌡️';
            default:
                return '📢';
        }
    };

    return (
        <div className="fixed bottom-8 right-8 max-w-md w-full bg-blue-50 border border-blue-200 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-500 ease-in-out">
            <div className="p-4 bg-blue-100 flex items-center border-b border-blue-200">
                <Volume2 className="w-5 h-5 text-blue-700 mr-2" />
                <span className="font-semibold text-blue-800">Alexa Announcement</span>
                <span className="flex-grow"></span>
                <button
                    onClick={() => setShowAnnouncement(false)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    ×
                </button>
            </div>
            <div className="p-4">
                <p className="text-sm text-blue-800 mb-3">{currentAnnouncement.message}</p>
                <div className="flex items-center bg-white p-2 rounded">
                    <span className="text-lg mr-2">{getImpactIcon(currentAnnouncement.impactType)}</span>
                    <span className="text-xs text-gray-600">{currentAnnouncement.impactDescription}</span>
                </div>
            </div>
        </div>
    );
};

export default AlexaAnnouncement;