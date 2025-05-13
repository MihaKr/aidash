import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTemperature } from '@/app/context/TemperatureContext';

const TemperatureUpdateNotification = () => {
    const { temperature, lastUpdated } = useTemperature();

    if (!lastUpdated) return null;

    // Only show notification for 10 seconds after update
    const timeSinceUpdate = Date.now() - lastUpdated.getTime();
    if (timeSinceUpdate > 10000) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-md animate-fadeIn">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                        Temperature Updated
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                        Temperature has been set to {temperature}°C
                        {temperature > 21 && (
                            <span className="block text-xs mt-1 text-blue-600">
                                Note: Setting above 21°C may increase energy costs
                            </span>
                        )}
                    </div>
                    <div className="mt-2 text-xs text-blue-500">
                        Updated {lastUpdated.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemperatureUpdateNotification;