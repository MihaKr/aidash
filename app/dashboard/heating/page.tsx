// app/dashboard/heating/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTemperature } from '../../context/TemperatureContext';

export default function HeatingPage() {
    const { temperature, setTemperature } = useTemperature();
    const [isHome, setIsHome] = useState(false);
    const [smartMode, setSmartMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Client-side only
    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate current energy cost
    const calculateCost = () => {
        const hourlyRate = 0.25;
        const baseConsumption = 1.2; // kWh
        const tempFactor = temperature / 20;

        return baseConsumption * tempFactor * hourlyRate;
    };

    const calculateWaste = () => {
        if (isHome || smartMode) return 0;
        return calculateCost();
    };

    const calculateMonthlyWaste = () => {
        return calculateWaste() * 8 * 30;
    };

    const enableSmartMode = () => {
        setSmartMode(true);
    };

    if (!mounted) {
        return <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Smart Heating Control</h1>
            <div className="min-h-screen"></div>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Smart Heating Control</h1>

            {/* Home Status Simulation */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">Simulation Controls</h2>
                <div className="flex items-center mb-4">
                    <span className="mr-4">Home Status:</span>
                    <button
                        onClick={() => setIsHome(true)}
                        className={`px-3 py-1 rounded mr-2 ${isHome ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        At Home
                    </button>
                    <button
                        onClick={() => setIsHome(false)}
                        className={`px-3 py-1 rounded ${!isHome ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                        Away
                    </button>
                </div>
            </div>

            {/* Economic Nudge Warning */}
            {!isHome && !smartMode && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">You're wasting money right now!</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Your heating is set to {temperature}°C but you're not home.</p>
                                <p className="font-bold">
                                    This is costing you €{calculateWaste().toFixed(2)}/hour unnecessarily.
                                </p>
                                <p>That's about €{calculateMonthlyWaste().toFixed(2)} wasted every month!</p>
                                <button
                                    onClick={enableSmartMode}
                                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
                                >
                                    Enable Smart Heating Mode
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Mode Toggle */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Smart Heating Mode</h2>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={smartMode}
                            onChange={() => setSmartMode(!smartMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>
                <p className="text-gray-600 mt-2">
                    {smartMode
                        ? "Smart mode is ON. Your heating will automatically adjust when you leave and preheat before you return."
                        : "Smart mode is OFF. Your heating stays at the same temperature regardless of whether you're home."}
                </p>

                {smartMode && (
                    <div className="mt-4 p-3 bg-green-50 rounded">
                        <p className="text-green-800">
                            <span className="font-semibold">Smart Savings:</span> Approximately €{calculateMonthlyWaste().toFixed(2)} per month
                        </p>
                    </div>
                )}
            </div>

            {/* Temperature Control */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Temperature Setting</h2>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">{temperature}°C</span>
                    <div className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {isHome ? 'Home' : smartMode ? 'Auto-Eco' : 'Manual'}
                    </div>
                </div>
                <input
                    type="range"
                    min="16"
                    max="28"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>16°C</span>
                    <span>22°C</span>
                    <span>28°C</span>
                </div>

                <div className="mt-4">
                    <p className="text-gray-700">
                        Current cost: <span className="font-semibold">€{calculateCost().toFixed(2)}/hour</span>
                        {!isHome && !smartMode && (
                            <span className="text-red-600"> (wasted money)</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Current Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded p-3">
                        <div className="text-gray-500 text-sm">Home Status</div>
                        <div className={`text-lg font-semibold ${isHome ? 'text-green-600' : 'text-red-600'}`}>
                            {isHome ? 'At Home' : 'Away'}
                        </div>
                    </div>
                    <div className="border rounded p-3">
                        <div className="text-gray-500 text-sm">Current Temperature</div>
                        <div className="text-lg font-semibold">
                            {temperature}°C
                            {!isHome && smartMode && (
                                <span className="text-xs text-gray-500"> (would be 16°C)</span>
                            )}
                        </div>
                    </div>
                    <div className="border rounded p-3">
                        <div className="text-gray-500 text-sm">Energy Cost</div>
                        <div className="text-lg font-semibold">
                            €{calculateCost().toFixed(2)}/hour
                            {!isHome && smartMode && (
                                <span className="text-xs text-green-500"> (saving €0.18/h)</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Simplified Recommendation */}
            {!smartMode && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Recommendation</h2>
                    <p className="text-blue-700 mb-3">
                        By enabling Smart Heating Mode, you could save approximately €{calculateMonthlyWaste().toFixed(2)} per month when you're not home.
                    </p>
                    <button
                        onClick={enableSmartMode}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Enable Smart Heating
                    </button>
                </div>
            )}
        </div>
    );
}