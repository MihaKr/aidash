// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TreeNudge from '@/components/TreeNudge';
import { AlertTriangle, ThermometerSun } from 'lucide-react';

export default function DashboardPage() {
    const [usageData, setUsageData] = useState({
        heatingOn: true,
        temperature: 24,
        electricityUsage: 6.8,
        averageElectricity: 7.5
    });

    const [alexaConnected, setAlexaConnected] = useState(false);
    const [showAlexaPrompt, setShowAlexaPrompt] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Client-side only to prevent hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    // Function to simulate connecting to Alexa
    const connectToAlexa = () => {
        setAlexaConnected(true);
        setShowAlexaPrompt(false);
    };

    if (!mounted) {
        // During SSR or before hydration, return a minimal layout to avoid hydration errors
        return <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Eco Smart Home</h1>
            <div className="min-h-screen"></div>
        </div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Eco Smart Home</h1>

            {/* Alexa Connection Prompt - only show if not connected */}
            {showAlexaPrompt && (
                <div className="mb-6 flex items-start border-l-4 border-blue-500 bg-blue-50 p-4">
                    <div className="flex-shrink-0 text-blue-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Connect Alexa for Usage Updates</h3>
                        <p className="mt-1 text-sm text-blue-700">
                            Link your Alexa account to receive heating updates when you say &#34;Alexa, I&#39;m home&#34;
                        </p>
                        <div className="mt-2">
                            <button
                                onClick={connectToAlexa}
                                className="mr-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                            >
                                Connect Alexa
                            </button>
                            <button
                                onClick={() => setShowAlexaPrompt(false)}
                                className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area - Two Column Layout with Focus on Tree */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Tree Visualization */}
                <div className="lg:col-span-8 bg-green-50 rounded-lg p-6 flex justify-center items-center min-h-[500px]">
                    <TreeNudge usageData={usageData} />
                </div>

                {/* Right Column - Minimalist Stats */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Current Heating Status */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center mb-2">
                            <ThermometerSun className="h-5 w-5 text-orange-500 mr-2" />
                            <h2 className="text-lg font-semibold">Heating Status</h2>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <span>Current</span>
                            <div className="flex items-center">
                                <span className="text-xl font-bold">{usageData.temperature}°C</span>
                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">+3°C</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <span>Recommended</span>
                            <span className="text-lg font-medium">21°C</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span>Status</span>
                            <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">ON</span>
                        </div>
                        <div className="mt-4">
                            <Link href="/dashboard/heating" className="block w-full text-center rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                                Adjust Heating
                            </Link>
                        </div>
                    </div>

                    {/* Impact Summary */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-3">Impact Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span>Energy usage</span>
                                <span className="font-medium">3.2 kWh/day</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Est. monthly cost</span>
                                <span className="font-medium">€78</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Potential savings</span>
                                <span className="font-medium text-green-600">€30/month</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/dashboard/analytics" className="block w-full text-center rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                View Detailed Analytics
                            </Link>
                        </div>
                    </div>

                    {/* Alert Card */}
                    <div className="bg-red-50 rounded-lg shadow p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 text-red-500">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Heating on in empty home</h3>
                                <p className="text-xs text-red-700 mt-1">
                                    Currently set to {usageData.temperature}°C but no one is home.
                                    Potential waste: €40/month.
                                </p>
                                <Link href="/dashboard/heating" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                    Fix this issue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}