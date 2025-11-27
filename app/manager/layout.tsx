'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { TitleProvider } from '@/context/TitleContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GuardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'MANAGER') {
                router.push('/login');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;

    if (!user) return null;

    return (
        <TitleProvider>
            <div className="app-layout" style={{ display: 'flex' }}>
                <Sidebar user={user} />
                <div className="main-area" style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
                    <Topbar user={user} />
                    <div className="content" style={{flex: 1}}>{children}</div>
                </div>
            </div>
        </TitleProvider>
    );
}