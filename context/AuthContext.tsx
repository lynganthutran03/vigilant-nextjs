'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AuthUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await axios.get<AuthUser>("/api/userinfo");
                setUser(res.data);
            } catch (err) {
                console.log("Chưa đăng nhập hoặc phiên hết hạn");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);