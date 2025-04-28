// app/dashboard/alexa/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, BellRing, X } from 'lucide-react';

export default function AlexaSettingsPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [customInstructions, setCustomInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to handle Alexa connection
    const handleConnect = () => {
        setIsLoading(true);

        // Simulate API call to connect with Alexa
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
            setShowSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }, 1500);
    };

    // Function to handle disconnect
    const handleDisconnect = () => {
        setIsLoading(true);

        // Simulate API call to disconnect
        setTimeout(() => {
            setIsConnected(false);
            setNotificationsEnabled(false);
            setIsLoading(false);
        }, 1000);
    };

    // Function to save settings
    const handleSaveSettings = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call to save settings
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Alexa Integration Settings</h1>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 transition-opacity duration-300">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Settings saved successfully!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Connection Status Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Alexa Connection</h2>
                        <p className="text-gray-600 mt-1">
                            Connect your Eco Smart Home with Alexa to receive voice updates
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Image
                            src="/window.svg" // Placeholder - you can use an Alexa logo here
                            alt="Alexa Logo"
                            width={40}
                            height={40}
                            className="opacity-70"
                        />
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Not Connected'}</span>
                </div>

                {isConnected ? (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Your Eco Smart Home is connected to Alexa. You can now say &#34;Alexa, I&#39;m home&#34; to get updates on your energy usage.
                        </p>
                        <button
                            onClick={handleDisconnect}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                        >
                            {isLoading ? 'Disconnecting...' : (
                                <>
                                    <X className="h-4 w-4 mr-1" />
                                    Disconnect from Alexa
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Connect your Eco Smart Home to Alexa to get voice updates and control your smart home features.
                        </p>
                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {isLoading ? 'Connecting...' : 'Connect with Alexa'}
                        </button>
                    </div>
                )}
            </div>

            {/* Settings Form */}
            {isConnected && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Alexa Notification Settings</h2>

                    <form onSubmit={handleSaveSettings}>
                        {/* Notification Toggle */}
                        <div className="mb-6">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                    />
                                    <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                                    <div className={`toggle-dot absolute w-4 h-4 bg-white rounded-full shadow left-1 top-1 transition ${notificationsEnabled ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <div className="ml-3 text-gray-700 font-medium">
                                    Enable Proactive Notifications
                                </div>
                            </label>
                            <p className="text-gray-500 text-sm mt-1 ml-13">
                                Allow Alexa to notify you when there are important updates about your energy usage.
                            </p>
                        </div>

                        {/* Custom Instructions */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Custom Instructions
                            </label>
                            <textarea
                                value={customInstructions}
                                onChange={(e) => setCustomInstructions(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Add any specific instructions for how Alexa should respond (e.g., 'Always include temperature information')"
                            ></textarea>
                        </div>

                        {/* Notification Types */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Receive Notifications For:
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                                    <span className="ml-2 text-gray-700">High energy usage alerts</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                                    <span className="ml-2 text-gray-700">Empty home energy waste</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                                    <span className="ml-2 text-gray-700">Daily eco-impact summary</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                                    <span className="ml-2 text-gray-700">Tips and recommendations</span>
                                </label>
                            </div>
                        </div>

                        {/* Example Phrases */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-md">
                            <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                                <BellRing className="h-4 w-4 mr-2 text-blue-500" />
                                Try These Voice Commands
                            </h3>
                            <ul className="text-gray-600 text-sm space-y-1">
                                <li>&#34;Alexa, I&#39;m home&#34;</li>
                                <li>&#34;Alexa, ask Eco Smart Home what&#39;s my environmental impact&#34;</li>
                                <li>&#34;Alexa, ask Eco Smart Home how my tree is doing&#34;</li>
                                <li>&#34;Alexa, ask Eco Smart Home for energy saving tips&#34;</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {isLoading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Setup Guide */}
            <div className="mt-6">
                <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
                    ← Back to Dashboard
                </Link>

                <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Setting Up Your Alexa Skill</h2>
                    <p className="text-blue-700 mb-4">
                        For developers: To set up the Alexa skill for your Eco Smart Home dashboard, follow these steps:
                    </p>
                    <ol className="list-decimal pl-5 text-blue-700 space-y-1">
                        <li>Create a new skill in the Alexa Developer Console</li>
                        <li>Configure the intents for &#34;I&#39;m home&#34; and &#34;environmental impact&#34;</li>
                        <li>Set up your endpoint to point to your API route</li>
                        <li>Test your skill in the Alexa Developer Console</li>
                    </ol>
                    <p className="mt-4 text-blue-700">
                        For detailed setup instructions, visit the <a href="/dashboard/alexa/setup" className="font-medium underline">Alexa Setup Guide</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}