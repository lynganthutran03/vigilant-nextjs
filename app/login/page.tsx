'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthUser } from '@/types';
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { setUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        try {
            await axios.post("/api/login", params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const res = await axios.get<AuthUser>("/api/userinfo");
            const userData = res.data;

            setUser(userData);

            if (userData.role === 'GUARD') {
                router.push('/guard');
            } else if (userData.role === 'MANAGER') {
                router.push('/manager');
            } else if (userData.role === 'ADMIN') {
                router.push('/admin');
            } else {
                setError("Tài khoản không có quyền truy cập.");
            }
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError("Tên đăng nhập hoặc mật khẩu không đúng.");
            } else {
                setError("Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Tên tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>
                {error && <p className='error-msg'>{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;