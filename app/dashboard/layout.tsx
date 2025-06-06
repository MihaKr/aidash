import React from 'react';
import TemperatureNotification from '@/components/TemperatureNotification';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Existing header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold">Eco Smart Home</h1>
                        </div>
                        <nav className="flex space-x-4">
                            <a href="/dashboard"
                               className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                                Dashboard
                            </a>
                            <a href="/dashboard/heating"
                               className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                                Heating
                            </a>
                            <a href="/dashboard/settings"
                               className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                                Settings
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Temperature Notification */}
            <TemperatureNotification/>
        </div>
    );
}