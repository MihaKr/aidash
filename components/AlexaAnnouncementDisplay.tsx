// components/AlexaAnnouncementDisplay.tsx
'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';

interface AnnouncementType {
    id: string;
    type: 'weather' | 'time' | 'energy' | 'temperature';
    label: string;
    message: string;
    detail: string;
}

interface AlexaAnnouncementDisplayProps {
    announcement: AnnouncementType | null;
    onClear: () => void;
}

const AlexaAnnouncementDisplay: React.FC<AlexaAnnouncementDisplayProps> = ({
                                                                               announcement,
                                                                               onClear
                                                                           }) => {
    if (!announcement) return null;

    // Type-specific styles and icons
    const getTypeStyles = () => {
        switch (announcement.type) {
            case 'weather':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                    text: 'text-blue-700',
                    title: 'text-blue-800'
                };
            case 'energy':
                return {
                    bg: 'bg-purple-50',
                    border: 'border-purple-100',
                    text: 'text-purple-700',
                    title: 'text-purple-800'
                };
            case 'time':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    text: 'text-amber-700',
                    title: 'text-amber-800'
                };
            case 'temperature':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-100',
                    text: 'text-red-700',
                    title: 'text-red-800'
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                    text: 'text-blue-700',
                    title: 'text-blue-800'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className={`mb-4 ${styles.bg} p-4 rounded-lg border ${styles.border} relative`}>
            <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={onClear}
            >
                ×
            </button>

            <div className="flex items-start">
                <Volume2 className={`h-5 w-5 ${styles.text} flex-shrink-0 mt-0.5 mr-3`} />
                <div className="flex-grow">
                    <h3 className={`text-sm font-medium ${styles.title} mb-1`}>
                        Alexa Announcement: {announcement.label}
                    </h3>
                    <p className={`text-sm ${styles.text} mb-2`}>{announcement.message}</p>

                    {announcement.detail && (
                        <p className="text-xs text-gray-600 italic">{announcement.detail}</p>
                    )}

                    <div className="mt-3">
            <span className={`text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full ${styles.text}`}>
              {announcement.type}
            </span>

                        <div className="mt-2 text-xs text-gray-500">
                            Announcement sent to Alexa API at https://aidash-xi.vercel.app/api/alexa
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlexaAnnouncementDisplay;