// components/TemperatureNotification.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTemperature } from '@/app/context/TemperatureContext';
import { Thermometer } from 'lucide-react';

const TemperatureNotification = () => {
    const { temperature, lastUpdated } = useTemperature();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (lastUpdated) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [lastUpdated]);

    if (!visible || !lastUpdated) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-blue-200 rounded-lg p-4 shadow-lg max-w-md animate-fadeIn">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Thermometer className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                        Temperature Updated
                    </h3>
                    <div className="mt-1">
                        <p className="text-sm text-gray-600">
                            Temperature has been set to {temperature}°C
                            {temperature > 21 && (
                                <span className="block text-xs mt-1 text-red-500">
                                    Warning: Setting above 21°C increases energy costs
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Updated at {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemperatureNotification;