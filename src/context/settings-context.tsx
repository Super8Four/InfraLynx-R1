
'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const SETTINGS_STORAGE_KEY = 'infralynx-settings';

type Settings = {
    isBranchingEnabled: boolean;
};

type SettingsContextType = {
    settings: Settings;
    toggleBranching: () => void;
    isLoading: boolean;
};

const defaultSettings: Settings = {
    isBranchingEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            // This code only runs on the client, so localStorage is safe
            const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleBranching = () => {
        setSettings(prevSettings => {
            const newSettings = { ...prevSettings, isBranchingEnabled: !prevSettings.isBranchingEnabled };
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
            } catch (error) {
                console.error("Failed to save settings to localStorage", error);
            }
            return newSettings;
        });
    };

    const value = { settings, toggleBranching, isLoading };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
