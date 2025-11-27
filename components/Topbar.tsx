'use client';

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthUser } from '@/types';
import { TitleContext } from '@/context/TitleContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import './Topbar.css';

interface Notification {
    id: number;
    message: string;
    createdAt: string;
    read: boolean;
}

interface TopbarProps {
    user: AuthUser;
    notificationCount?: number;
}

const Topbar = ({ user, notificationCount: managerPendingCount = 0 }: TopbarProps) => {
    const router = useRouter();
    const { title } = useContext(TitleContext);

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [hovering, setHovering] = useState<boolean>(false);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
    const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user.role !== 'ADMIN') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user.role]);

    const fetchNotifications = async () => {
        try {
            setIsLoadingNotifs(true);
            const res = await axios.get<Notification[]>("/api/notifications/mine");
            const notifs = res.data || [];
            setNotifications(notifs);

            const unread = notifs.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Lỗi khi tải thông báo: ", err);
        } finally {
            setIsLoadingNotifs(false);
        }
    }

    const handleBellClick = () => {
        const newState = !showDropdown;
        setShowDropdown(newState);
        if (newState) {
            fetchNotifications();
        }
    }

    const handleMarkRead = async (notifId: number) => {
        try {
            await axios.post(`/api/notifications/mark-read/${notifId}`);
            const updatedNotifs = notifications.map(n =>
                n.id === notifId ? { ...n, read: true } : n
            );

            setNotifications(updatedNotifs);
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Lỗi đánh dấu đã đọc: ", err);
        }
    }

    const handleQuickCheckIn = async () => {
        setIsCheckingIn(true);
        try {
            const res = await axios.post("/api/attendance/check-in");
            toast.success(res.data.message || "Điểm danh thành công!");
            setIsCheckedIn(true);
        } catch (err: any) {
            const message = err.response?.data?.message || "Lỗi khi điểm danh.";
            if (message.includes("đã điểm danh")) {
                setIsCheckedIn(true);
                toast.info("Bạn đã điểm danh rồi.");
            } else {
                toast.error(message);
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleLogout = () => {
        router.push('/login');
    };

    const timeString = currentTime ? currentTime.toLocaleDateString('vi-VN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : "...";

    const totalBadgeCount = (user.role === 'MANAGER' ? managerPendingCount : 0) + unreadCount;

    return (
        <div className="topbar">
            <div className="topbar-left">
                <h2>{title}</h2>
            </div>
            <div className="topbar-right">
                {user.role === 'GUARD' && (
                    <div className="attendance-widget">
                        <span className="live-clock">{timeString}</span>
                        <button
                            className={`quick-checkin-btn ${isCheckedIn ? 'checked-in' : ''}`}
                            onClick={handleQuickCheckIn}
                            disabled={isCheckingIn || isCheckedIn}
                        >
                            {isCheckingIn ? <i className="fa-solid fa-spinner fa-spin"></i> :
                                isCheckedIn ? <><i className="fa-solid fa-check-circle"></i> Đã Điểm Danh</> :
                                    <><i className="fa-solid fa-fingerprint"></i> Điểm Danh</>}
                        </button>
                    </div>
                )}

                {user.role !== 'ADMIN' && (
                    <div
                        className="notif-wrapper"
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => { setHovering(false); setShowDropdown(false); }}
                    >
                        <i className="fa-solid fa-bell notif-icon" onClick={handleBellClick}></i>
                        {totalBadgeCount > 0 && (
                            <span className="notif-badge">{totalBadgeCount}</span>
                        )}

                        {showDropdown && hovering && (
                            <div className="notif-dropdown">
                                <div className="notif-header">Thông báo</div>
                                <div className="notif-list">
                                    {isLoadingNotifs ? (
                                        <div className="notif-item loading">Đang tải...</div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                                                onClick={() => handleMarkRead(notif.id)}
                                            >
                                                <div className="notif-icon-box">
                                                    <i className="fa-solid fa-info-circle"></i>
                                                </div>
                                                <div className="notif-content">
                                                    <p>{notif.message}</p>
                                                    <span className="notif-time">
                                                        {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: vi })}
                                                    </span>
                                                </div>
                                                {!notif.read && <div className="unread-dot"></div>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="notif-item empty">Không có thông báo nào.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <img src="/images/avatar.jpg" alt="Avatar" className="avatar" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40'} />
                <span className="user-name">{user.fullName}</span>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        </div>
    )
}

export default Topbar;