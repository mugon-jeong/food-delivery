'use client';
import React from 'react';
import NextUiProvider from "@/src/app/providers/NextUiProvider";

const Providers = ({children}: { children: React.ReactNode }) => {
    return (
        <NextUiProvider>
            {children}
        </NextUiProvider>
    );
};

export default Providers;