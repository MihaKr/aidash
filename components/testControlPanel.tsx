// components/TestControlPanel.tsx
'use client';

import React, { useState } from 'react';
import { Volume2, Settings, X } from 'lucide-react';

interface Announcement {
    id: number;
    message: string;
    impactType: 'weather' | 'time' | 'energy' | 'temperature';
    impactDescription: string;
}

const predefinedAnnouncements: Announcement[] = [
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

interface TestControlPanelProps {
    onTriggerAnnouncement: (announcement: Announcement) => void;
}

const TestControlPanel: React.FC<TestControlPanelProps> = ({ onTriggerAnnouncement }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customMessage, setCustomMessage] = useState('');

    const triggerAnnouncement = (announcement: Announcement) => {
        onTriggerAnnouncement(announcement);
    };

    const triggerCustomAnnouncement = () => {
        if (!customMessage.trim()) return;

        const customAnnouncement: Announcement = {
            id: 999,
            message: customMessage,
            impactType: 'weather', // Default type
            impactDescription: 'Custom announcement'
        };

        onTriggerAnnouncement(customAnnouncement);
        setCustomMessage('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-6 bottom-6 bg-gray-800 text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-700"
                title="Test Controls"
            >
                <Settings className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed left-6 bottom-6 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-80">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">Test Control Panel</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Trigger pre-defined announcements:</p>
                <div className="space-y-2">
                    {predefinedAnnouncements.map(announcement => (
                        <button
                            key={announcement.id}
                            onClick={() => triggerAnnouncement(announcement)}
                            className="w-full text-left text-sm py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                        >
                            <span className="block font-medium truncate">{announcement.message.substring(0, 30)}...</span>
                            <span className="block text-xs text-gray-500">{announcement.impactType}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-600 mb-2">Or create a custom announcement:</p>
                <div className="flex">
                    <input
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter custom message..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={triggerCustomAnnouncement}
                        disabled={!customMessage.trim()}
                        className="bg-blue-600 text-white px-3 py-2 rounded-r text-sm hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <Volume2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestControlPanel;