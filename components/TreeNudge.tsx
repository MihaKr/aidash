'use client';

import React, { useState, useEffect } from 'react';

interface UsageData {
    heatingOn: boolean;
    temperature: number;
    electricityUsage: number;
    averageElectricity: number;
}

const TreeNudge = ({ usageData }: { usageData: UsageData | null }) => {
    // Use null initial state to prevent hydration mismatch
    const [treeHealth, setTreeHealth] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    // Use useEffect to set initial state client-side only
    useEffect(() => {
        setMounted(true);
        setTreeHealth(6); // Default value

        // Calculate tree health based on usage data
        if (!usageData) return;

        let newHealth = 10; // Start with full health
        let impactMessage = '';

        // Focus only on heating temperature
        if (usageData.heatingOn && usageData.temperature > 22) {
            const leavesLost = Math.floor((usageData.temperature - 21));
            newHealth -= leavesLost;
            impactMessage = `High heating temperature (${usageData.temperature}°C) is costing ${leavesLost} leaves.`;
        }

        // Set the final health value
        setTreeHealth(Math.max(0, Math.min(10, newHealth)));
        setMessage(impactMessage || 'Your eco-habits are keeping the tree healthy!');
    }, [usageData]);

    // Only render client-side to avoid hydration mismatch
    if (!mounted) {
        return null; // Return nothing during SSR
    }

    // Create leaf positions deterministically
    const leafPositions = [
        { x: 0, y: 0 }, // Center leaf
        { x: -60, y: 30 },
        { x: 60, y: 30 },
        { x: -40, y: 70 },
        { x: 40, y: 70 },
        { x: -80, y: 10 },
        { x: 80, y: 10 },
        { x: 0, y: 80 },
        { x: -30, y: -30 },
        { x: 30, y: -30 },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col lg:flex-row items-center justify-around w-full mb-4">
                <div className="text-center lg:text-left mb-4 lg:mb-0">
                    <div className="text-gray-500 text-sm">Electricity</div>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{usageData?.electricityUsage || "--"} kWh</span>
                        <span className="text-sm text-green-500">-12%</span>
                    </div>
                </div>

                <div className="text-center mb-4 lg:mb-0">
                    <div className="text-gray-500 text-sm">Heating</div>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{usageData?.temperature || "--"}°C</span>
                        <span className="text-sm text-red-500">+3°C</span>
                    </div>
                </div>

                <div className="text-center lg:text-right">
                    <div className="text-gray-500 text-sm">Today's Cost</div>
                    <div className="text-2xl font-bold">€2.50</div>
                </div>
            </div>

            <div className="relative w-72 h-80 flex justify-center items-center">
                {/* Tree trunk */}
                <div className="absolute bottom-0 w-10 h-44 bg-yellow-800 rounded-md"></div>

                {/* Tree foliage */}
                <div className="absolute bottom-36 w-full flex justify-center">
                    <div className="relative w-64 h-64">
                        {leafPositions.map((pos, i) => (
                            <div
                                key={i}
                                className={`absolute w-24 h-24 rounded-full transition-all duration-500 ease-in-out ${
                                    i === 0 || (treeHealth !== null && i < treeHealth)
                                        ? 'bg-green-500 opacity-100'
                                        : 'bg-gray-200 opacity-30'
                                }`}
                                style={{
                                    left: `calc(50% + ${pos.x}px)`,
                                    top: `calc(50% + ${pos.y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10 - i,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Gray cloud when health is low - only show when health is below 7 */}
                {treeHealth !== null && treeHealth < 7 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="relative">
                            <div className="absolute w-24 h-10 bg-gray-300 rounded-full opacity-70"></div>
                            <div className="absolute w-16 h-8 bg-gray-300 rounded-full opacity-70" style={{ left: '-10px', top: '-5px' }}></div>
                            <div className="absolute w-16 h-8 bg-gray-300 rounded-full opacity-70" style={{ left: '15px', top: '-8px' }}></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                <p className="text-md font-medium text-gray-700">{message}</p>
                {treeHealth !== null && (
                    <p className="mt-2 text-sm text-gray-600">
                        Tree health: {treeHealth}/10 leaves
                    </p>
                )}
            </div>

            <div className="mt-4 w-full max-w-md">
                <h3 className="font-bold text-green-700 mb-2">Today's Tips:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Try lowering your heating by 1°C to save 1 leaf</li>
                    <li>• Optimal temperature is 21°C for both comfort and efficiency</li>
                    <li>• Each degree above 21°C costs you approximately €10/month</li>
                </ul>
            </div>
        </div>
    );
};

export default TreeNudge;