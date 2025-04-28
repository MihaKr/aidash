// app/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import RadialGraph from '@/components/RadialTimeGraph';

export default function DashboardPage() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Eco Smart Home</h1>

            {/* Introduction Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Save Money and Energy</h2>
                <p className="mb-4">
                    Your smart home system helps you develop ecological habits by monitoring your energy usage
                    and providing suggestions that save you money while reducing your environmental impact.
                </p>
                <div className="flex justify-end">
                    <Link href="/dashboard/heating" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Go to Heating Control
                    </Link>
                </div>
            </div>

            {/* Energy Overview */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Todays Energy Overview</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <div className="text-gray-500 text-sm">Estimated Cost</div>
                            <div className="text-2xl font-bold">€2.50</div>
                            <div className="text-sm text-gray-500">Today so far</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Radial Time Graph */}
            <div className="mb-6">
                <RadialGraph />
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Recommendations</h2>
                </div>
                <div className="p-4">
                    <ul className="space-y-4">
                        <li key="heating-warning" className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-base font-medium">Heating is on but nobody's home</h3>
                                <p className="text-sm text-gray-600">
                                    Your heating is currently set to 22°C but no one is home. This could cost you
                                    over €40 in wasted energy this month.
                                </p>
                                <Link href="/dashboard/heating" className="text-sm text-blue-600 hover:underline">
                                    Fix this issue
                                </Link>
                            </div>
                        </li>
                        <li key="peak-hours-warning" className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-base font-medium">Peak electricity hours are approaching</h3>
                                <p className="text-sm text-gray-600">
                                    Electricity rates will be higher from 5PM to 8PM today. Consider adjusting your
                                    usage to save money.
                                </p>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Show me how
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
