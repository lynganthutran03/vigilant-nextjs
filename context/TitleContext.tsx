'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface TitleContextType {
    title: string;
    setTitle: (title: string) => void;
    notificationCount: number;
    setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const defaultState: TitleContextType = {
    title: '',
    setTitle: () => {},
    notificationCount: 0,
    setNotificationCount: () => {}
};

export const TitleContext = createContext<TitleContextType>(defaultState);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState<string>('');
    const [notificationCount, setNotificationCount] = useState<number>(0);

    return (
        <TitleContext.Provider value={{
            title,
            setTitle,
            notificationCount,
            setNotificationCount
        }}>
            {children}
        </TitleContext.Provider>
    );
};