// app/dashboard/analytics/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RadialGraph from '@/components/RadialTimeGraph';
import { Calendar, ChevronLeft } from 'lucide-react';

export default function AnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6 flex items-center gap-2">
                <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className="text-2xl font-bold ml-2">Detailed Energy Analytics</h1>
            </div>

            {/* Time Period Selector */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Viewing Period</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedPeriod('today')}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedPeriod === 'today'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('week')}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedPeriod === 'week'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('month')}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedPeriod === 'month'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            This Month
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center gap-1 hover:bg-gray-200"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Custom</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Energy Overview */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Energy Overview</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="border rounded p-4 text-center">
                            <div className="text-gray-500 text-sm">Electricity</div>
                            <div className="text-2xl font-bold">6.8 kWh</div>
                            <div className="text-sm text-green-500">-12% from average</div>
                        </div>
                        <div className="border rounded p-4 text-center">
                            <div className="text-gray-500 text-sm">Heating</div>
                            <div className="text-2xl font-bold">3.2 kWh</div>
                            <div className="text-sm text-red-500">+8% from average</div>
                        </div>
                        <div className="border rounded p-4 text-center">
                            <div className="text-gray-500 text-sm">Water</div>
                            <div className="text-2xl font-bold">150 L</div>
                            <div className="text-sm text-red-500">+25% from average</div>
                        </div>
                        <div className="border rounded p-4 text-center">
                            <div className="text-gray-500 text-sm">Total Cost</div>
                            <div className="text-2xl font-bold">€2.50</div>
                            <div className="text-sm text-gray-500">So far today</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Radial Time Graph */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <h2 className="text-lg font-semibold mb-4">24-Hour Energy Pattern</h2>
                <RadialGraph />
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">Energy Usage Breakdown</h2>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        {/* Placeholder for energy breakdown chart */}
                        <p className="text-gray-500">Energy breakdown chart will appear here</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Heating</span>
                            <span className="text-sm font-medium">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-3 mb-2">
                            <span className="text-sm text-gray-600">Appliances</span>
                            <span className="text-sm font-medium">30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-3 mb-2">
                            <span className="text-sm text-gray-600">Lighting</span>
                            <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-3 mb-2">
                            <span className="text-sm text-gray-600">Other</span>
                            <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">Historical Comparison</h2>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        {/* Placeholder for historical comparison chart */}
                        <p className="text-gray-500">Historical comparison chart will appear here</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Today</span>
                            <span className="text-sm font-medium">10.0 kWh</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Yesterday</span>
                            <span className="text-sm font-medium">11.2 kWh</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Week (avg/day)</span>
                            <span className="text-sm font-medium">10.8 kWh</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Month (avg/day)</span>
                            <span className="text-sm font-medium">12.5 kWh</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Environmental Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-green-50">
                        <div className="text-center mb-2">
                            <div className="text-green-600 text-sm">Carbon Footprint</div>
                            <div className="text-2xl font-bold">4.2 kg CO₂</div>
                            <div className="text-sm text-green-700">-8% from average</div>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                            Equivalent to driving an average car for 16.8 km
                        </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="text-center mb-2">
                            <div className="text-blue-600 text-sm">Water Saved</div>
                            <div className="text-2xl font-bold">0 L</div>
                            <div className="text-sm text-red-500">Using more than average</div>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                            Try shorter showers to improve your water usage
                        </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-purple-50">
                        <div className="text-center mb-2">
                            <div className="text-purple-600 text-sm">Energy Efficiency</div>
                            <div className="text-2xl font-bold">B+</div>
                            <div className="text-sm text-purple-700">Top 30% of similar homes</div>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                            Improve to A rating by following recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Download/Share Section */}
            <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2">
                    Download Report
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Share Insights
                </button>
            </div>
        </div>
    );
}