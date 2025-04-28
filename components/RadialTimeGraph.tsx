'use client';

import React, { useState } from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface HourlyData {
    time: string;
    usage: number;
    cost: number;
    status: 'Home' | 'Away' | 'Sleep';
    fill: string;
}

const hourlyData: HourlyData[] = [
    { time: '12 AM', usage: 0.4, cost: 0.19, status: 'Sleep', fill: '#60a5fa' },
    { time: '2 AM', usage: 0.3, cost: 0.19, status: 'Sleep', fill: '#60a5fa' },
    { time: '4 AM', usage: 0.3, cost: 0.19, status: 'Sleep', fill: '#60a5fa' },
    { time: '6 AM', usage: 0.7, cost: 0.19, status: 'Home', fill: '#4ade80' },
    { time: '8 AM', usage: 0.6, cost: 0.19, status: 'Away', fill: '#f87171' },
    { time: '10 AM', usage: 0.5, cost: 0.19, status: 'Away', fill: '#f87171' },
    { time: '12 PM', usage: 0.5, cost: 0.19, status: 'Away', fill: '#f87171' },
    { time: '2 PM', usage: 0.5, cost: 0.19, status: 'Away', fill: '#f87171' },
    { time: '4 PM', usage: 0.7, cost: 0.19, status: 'Away', fill: '#f87171' },
    { time: '6 PM', usage: 1.1, cost: 0.19, status: 'Home', fill: '#4ade80' },
    { time: '8 PM', usage: 0.9, cost: 0.19, status: 'Home', fill: '#4ade80' },
    { time: '10 PM', usage: 0.5, cost: 0.19, status: 'Sleep', fill: '#60a5fa' },
];

const wastedUsage = hourlyData
    .filter(hour => hour.status === 'Away')
    .reduce((sum, hour) => sum + hour.usage, 0);

const wastedCost = hourlyData
    .filter(hour => hour.status === 'Away')
    .reduce((sum, hour) => sum + hour.cost, 0);

const RadialGraph = () => {
    const [viewMode, setViewMode] = useState<'usage' | 'cost'>('usage');

    const data = hourlyData.map(hour => ({
        ...hour,
        value: viewMode === 'usage' ? hour.usage : hour.cost,
    }));

    const CustomTooltip = ({
                               active,
                               payload,
                           }: {
        active?: boolean;
        payload?: any[];
    }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            const statusColors: Record<string, string> = {
                Home: 'bg-green-100 text-green-800 border-green-200',
                Away: 'bg-red-100 text-red-800 border-red-200',
                Sleep: 'bg-blue-100 text-blue-800 border-blue-200',
            };

            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-800">{item.time}</p>
                    <div className={`mt-1 px-2 py-1 rounded-full text-xs inline-block ${statusColors[item.status]}`}>
                        {item.status}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                        <div className="text-sm text-gray-600">Energy:</div>
                        <div className="text-sm font-medium text-gray-800">{item.usage.toFixed(1)} kWh</div>
                        <div className="text-sm text-gray-600">Cost:</div>
                        <div className="text-sm font-medium text-gray-800">€{item.cost.toFixed(2)}</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomizedLegend = () => (
        <div className="flex justify-center mt-4 space-x-4">
            {[
                { label: 'At Home', color: 'bg-green-500' },
                { label: 'Away', color: 'bg-red-500' },
                { label: 'Sleep', color: 'bg-blue-500' },
            ].map(({ label, color }) => (
                <div className="flex items-center" key={label}>
                    <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
                    <span className="text-xs">{label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">24-Hour Heating Pattern</h2>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                    {['usage', 'cost'].map(mode => (
                        <button
                            key={mode}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                viewMode === mode
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => setViewMode(mode as 'usage' | 'cost')}
                        >
                            {mode === 'usage' ? 'Energy (kWh)' : 'Cost (€)'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5">
                    <div className="relative h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                <PolarGrid gridType="polygon" />
                                <PolarAngleAxis
                                    dataKey="time"
                                    tick={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fill: '#4b5563',
                                    }}
                                    tickLine={false}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, viewMode === 'usage' ? 1.5 : 0.3]}
                                    tick={{ fontSize: 10 }}
                                    axisLine={false}
                                    tickCount={5}
                                />
                                <Radar
                                    name={viewMode === 'usage' ? 'Energy Usage (kWh)' : 'Energy Cost (€)'}
                                    dataKey="value"
                                    stroke="#2563eb"
                                    fill="#3b82f6"
                                    fillOpacity={0.6}
                                    dot={({ cx, cy, payload, index }) => (
                                        <circle
                                            key={`dot-${payload?.time}-${index}`}
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={payload?.fill}
                                            stroke="#fff"
                                            strokeWidth={2}
                                        />
                                    )}
                                    activeDot={{
                                        r: 8,
                                        stroke: '#fff',
                                        strokeWidth: 2,
                                        fill: (props: any) => props.payload.fill,
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <CustomizedLegend />
                    </div>
                </div>

                <div className="md:w-2/5 mt-6 md:mt-0 md:pl-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-5">
                        <h3 className="text-base font-semibold text-gray-800 mb-2">Understanding This Chart</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            This chart shows your heating usage throughout a day. Longer spikes mean more energy used at that time.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Green dots: When you're home</li>
                            <li>• Red dots: When you're away (wasting energy)</li>
                            <li>• Blue dots: When you're sleeping</li>
                        </ul>
                        <div className="mt-3 text-sm text-gray-600">
                            <strong>Tip:</strong> Notice how much energy is used between 8AM–4PM when no one is home.
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="font-bold text-red-800">Money Wasted</h3>
                        </div>
                        <div className="text-3xl font-bold text-red-600">€{wastedCost.toFixed(2)}</div>
                        <div className="text-sm text-red-700 mb-3">per day when heating an empty home</div>
                        <div className="text-sm bg-white bg-opacity-50 p-2 rounded text-red-900">
                            That’s approximately <strong>€{(wastedCost * 30).toFixed(2)}</strong> wasted every month!
                        </div>
                        <div className="mt-4">
                            <button className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                                Enable Smart Heating to Save Money
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadialGraph;
