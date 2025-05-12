// components/AlexaTestPanel.tsx (Updated)
'use client';

import React, { useState } from 'react';
import { Settings, X, Send } from 'lucide-react';

interface AnnouncementType {
    id: string;
    type: 'weather' | 'time' | 'energy' | 'temperature';
    label: string;
    message: string;
    detail: string;
}

const predefinedAnnouncements: AnnouncementType[] = [
    {
        id: 'cloudy',
        type: 'weather',
        label: 'Cloudy Weather',
        message: 'The weather outside is now cloudy. Your solar panels are producing less electricity.',
        detail: 'Consider reducing your electricity usage temporarily.'
    },
    {
        id: 'rain',
        type: 'weather',
        label: 'Rain',
        message: 'It\'s now raining outside. Temperatures will drop over the next hour.',
        detail: 'Your heating system may need to work harder soon.'
    },
    {
        id: 'peak',
        type: 'time',
        label: 'Peak Energy Hours',
        message: 'The time is now 17:00. You\'re entering peak energy cost hours.',
        detail: 'Electricity costs more during this time period.'
    },
    {
        id: 'grid',
        type: 'energy',
        label: 'High Grid Usage',
        message: 'Your neighborhood is experiencing high energy usage. Grid is under strain.',
        detail: 'Consider reducing non-essential electricity usage.'
    },
    {
        id: 'cold',
        type: 'temperature',
        label: 'Temperature Drop',
        message: 'Outside temperature has dropped to 5°C. Insulation effectiveness decreases.',
        detail: 'Your heating system will work harder to maintain temperature.'
    }
];

interface AlexaTestPanelProps {
    onAnnouncementSent: (announcement: AnnouncementType) => void;
}

const AlexaTestPanel: React.FC<AlexaTestPanelProps> = ({ onAnnouncementSent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementType | null>(null);
    const [customMessage, setCustomMessage] = useState('');
    const [customDetail, setCustomDetail] = useState('');
    const [customType, setCustomType] = useState<'weather' | 'time' | 'energy' | 'temperature'>('weather');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message: string } | null>(null);

    // Send a predefined announcement
    const sendPredefinedAnnouncement = async () => {
        if (!selectedAnnouncement) return;

        setIsSending(true);
        setStatus(null);

        try {
            // Call the Alexa announce API
            const response = await fetch('/api/alexa/announce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: selectedAnnouncement.message,
                    type: selectedAnnouncement.type,
                    detail: selectedAnnouncement.detail
                })
            });

            const result = await response.json();

            if (result.success) {
                // Call the callback
                onAnnouncementSent(selectedAnnouncement);

                // Show success message
                setStatus({
                    success: true,
                    message: 'Announcement sent successfully!'
                });
            } else {
                setStatus({
                    success: false,
                    message: result.error || 'Failed to send announcement'
                });
            }
        } catch (error) {
            console.error('Error sending announcement:', error);
            setStatus({
                success: false,
                message: 'Error sending announcement'
            });
        } finally {
            setIsSending(false);
        }
    };

    // Send a custom announcement
    const sendCustomAnnouncement = async () => {
        if (!customMessage) return;

        setIsSending(true);
        setStatus(null);

        try {
            // Create a custom announcement object
            const customAnnouncement: AnnouncementType = {
                id: `custom-${Date.now()}`,
                type: customType,
                label: 'Custom Announcement',
                message: customMessage,
                detail: customDetail || ''
            };

            // Call the Alexa announce API
            const response = await fetch('/api/alexa/announce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: customMessage,
                    type: customType,
                    detail: customDetail
                })
            });

            const result = await response.json();

            if (result.success) {
                // Call the callback
                onAnnouncementSent(customAnnouncement);

                // Show success message
                setStatus({
                    success: true,
                    message: 'Custom announcement sent successfully!'
                });

                // Reset form
                setCustomMessage('');
                setCustomDetail('');
            } else {
                setStatus({
                    success: false,
                    message: result.error || 'Failed to send custom announcement'
                });
            }
        } catch (error) {
            console.error('Error sending custom announcement:', error);
            setStatus({
                success: false,
                message: 'Error sending custom announcement'
            });
        } finally {
            setIsSending(false);
        }
    };

    // If panel is closed, just show the toggle button
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-6 bottom-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700"
                title="Alexa Test Panel"
            >
                <Settings className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed left-6 bottom-6 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-96 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-white pb-2 border-b">
                <h3 className="font-medium text-gray-800">Alexa Test Panel</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Status message */}
            {status && (
                <div className={`mb-4 p-2 rounded ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.message}
                </div>
            )}

            {/* Predefined announcements */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">Predefined Announcements</h4>
                    <button
                        onClick={sendPredefinedAnnouncement}
                        disabled={!selectedAnnouncement || isSending}
                        className={`text-xs px-3 py-1 rounded ${
                            !selectedAnnouncement || isSending
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        {isSending ? 'Sending...' : 'Send Selected'}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-4">
                    {predefinedAnnouncements.map(announcement => (
                        <button
                            key={announcement.id}
                            onClick={() => setSelectedAnnouncement(announcement)}
                            className={`text-left p-2 rounded border text-sm ${
                                selectedAnnouncement?.id === announcement.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{announcement.label}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {announcement.type}
                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{announcement.message}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom announcement */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Custom Announcement</h4>

                <div className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">Type</label>
                    <select
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="weather">Weather</option>
                        <option value="time">Time</option>
                        <option value="energy">Energy</option>
                        <option value="temperature">Temperature</option>
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">Announcement Message</label>
                    <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter announcement message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        rows={2}
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">Detail/Suggestion (optional)</label>
                    <textarea
                        value={customDetail}
                        onChange={(e) => setCustomDetail(e.target.value)}
                        placeholder="Enter additional details or suggestions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        rows={2}
                    />
                </div>

                <button
                    onClick={sendCustomAnnouncement}
                    disabled={!customMessage || isSending}
                    className={`w-full py-2 rounded flex items-center justify-center ${
                        !customMessage || isSending
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    <Send className="w-4 h-4 mr-1" />
                    {isSending ? 'Sending...' : 'Send Custom Announcement'}
                </button>
            </div>

            {/* Help section */}
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
                <h4 className="font-medium text-gray-700 mb-1">Using with Alexa</h4>
                <p className="text-gray-600">
                    When you send an announcement, it will appear at the top of your dashboard.
                    You can then use the "Copy for Alexa" button to copy the text and paste it
                    into the Alexa simulator for playback.
                </p>
            </div>
        </div>
    );
};

export default AlexaTestPanel;