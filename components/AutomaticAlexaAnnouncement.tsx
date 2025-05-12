// components/AutomaticAlexaAnnouncement.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RefreshCw, InfoIcon } from 'lucide-react';

interface Announcement {
    id: string;
    type: 'weather' | 'time' | 'energy' | 'temperature';
    label: string;
    message: string;
    detail: string;
}

interface AutomaticAlexaAnnouncementProps {
    announcement: Announcement | null;
    onClear?: () => void;
}

const AutomaticAlexaAnnouncement: React.FC<AutomaticAlexaAnnouncementProps> = ({
                                                                                   announcement,
                                                                                   onClear
                                                                               }) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [autoSend, setAutoSend] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);

    // Format announcement for Alexa
    const getAlexaCommand = () => {
        if (!announcement) return '';
        return `Alexa, tell Eco Smart Home ${announcement.message}`;
    };

    // Copy text to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(getAlexaCommand())
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    // Auto-send to Alexa simulator if found
    useEffect(() => {
        if (!announcement || !autoSend) return;

        // Try to find Alexa simulator input field by checking for common identifiers
        // Note: This is experimental and depends on the structure of the Alexa simulator
        setTimeout(() => {
            try {
                // Look for possible Alexa simulator input fields
                const possibleSelectors = [
                    'input[placeholder*="alexa"]',
                    'input[aria-label*="alexa"]',
                    'textarea[placeholder*="alexa"]',
                    'input.askt-utterance__input',
                    '#askt-utterance-input'
                ];

                // Try each selector
                for (const selector of possibleSelectors) {
                    const inputElement = document.querySelector(selector) as HTMLInputElement | null;
                    if (inputElement) {
                        // Found a possible Alexa input, try to set its value and dispatch events
                        inputElement.value = getAlexaCommand();
                        inputElement.dispatchEvent(new Event('input', { bubbles: true }));

                        // Try to find and click the send button
                        const possibleButtons = [
                            'button[aria-label*="send"]',
                            'button.askt-utterance__button',
                            'button[type="submit"]',
                            'button:has(svg[aria-label*="send"])'
                        ];

                        for (const buttonSelector of possibleButtons) {
                            const button = document.querySelector(buttonSelector) as HTMLButtonElement | null;
                            if (button) {
                                button.click();
                                console.log('Successfully sent to Alexa simulator');
                                return;
                            }
                        }

                        // If no button found, try pressing Enter
                        inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Enter',
                            keyCode: 13
                        }));

                        console.log('Attempted to send to Alexa simulator with Enter key');
                        return;
                    }
                }

                console.log('Could not find Alexa simulator input field');
            } catch (error) {
                console.error('Error attempting to auto-send to Alexa:', error);
            }
        }, 500);
    }, [announcement, autoSend]);

    // Close instructions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (instructionsRef.current && !instructionsRef.current.contains(event.target as Node)) {
                setShowInstructions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!announcement) return null;

    return (
        <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100 relative">
            <button
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
                onClick={onClear}
            >
                ×
            </button>

            <div className="flex items-start">
                <Volume2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
                <div className="flex-grow">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Alexa Announcement</h3>
                    <p className="text-sm text-blue-700 mb-2">{announcement.message}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <div className="flex-grow">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {announcement.type}
              </span>
                        </div>

                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <InfoIcon className="h-3 w-3 mr-1" />
                            Help
                        </button>

                        <div className="flex items-center">
                            <label className="text-xs text-blue-600 mr-2 flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoSend}
                                    onChange={() => setAutoSend(!autoSend)}
                                    className="mr-1 h-3 w-3"
                                />
                                Auto-send
                            </label>

                            <button
                                onClick={copyToClipboard}
                                className={`text-xs px-3 py-1 rounded ${
                                    copySuccess
                                        ? 'bg-green-600 text-white'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {copySuccess ? 'Copied!' : 'Copy for Alexa'}
                            </button>
                        </div>
                    </div>

                    {/* Instructions Popup */}
                    {showInstructions && (
                        <div
                            ref={instructionsRef}
                            className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-700 w-64"
                        >
                            <h4 className="font-medium mb-2">How to use with Alexa simulator:</h4>
                            <ol className="list-decimal pl-4 space-y-1 mb-2">
                                <li>Open Alexa Developer Console</li>
                                <li>Go to the Test tab of your skill</li>
                                <li>Click "Copy for Alexa" button</li>
                                <li>Paste into the simulator input</li>
                                <li>Press Enter to hear the announcement</li>
                            </ol>
                            <p className="text-xs text-blue-600">
                                Enable "Auto-send" to attempt automatic sending (experimental)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AutomaticAlexaAnnouncement;