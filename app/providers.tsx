// app/providers.tsx
'use client';

import React from 'react';
import { TemperatureProvider } from './context/TemperatureContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TemperatureProvider>
            {children}
        </TemperatureProvider>
    );
}