'use client';

import Link from "next/link";
import React, { useState} from "react";
import { usePathname } from "next/navigation";
import { AuthUser } from '@/types';
import './Sidebar.css';

interface SidebarProps {
    user: AuthUser;
}

const Sidebar = ({ user }: SidebarProps) => {
    const [viewOpen, setViewOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const toggleView = () => setViewOpen(!viewOpen);

    const isActive = (path: string) => pathname === path ? 'active-link' : '';

    const renderNavLinks = () => {
        if(user.role === 'GUARD') {
            return (
                <>
                    <li className={isActive('/guard')}>
                        <Link href="/guard">
                            <i className="fa-solid fa-chart-simple"></i>Trang Chủ
                        </Link>
                    </li>
                    <li className={isActive('/guard/today-shift')}>
                        <Link href="/guard/today-shift">
                            <i className="fa-solid fa-calendar-days"></i>Ca Trực Hôm Nay
                        </Link>
                    </li>
                    <li className={isActive('/guard/leave-request')}>
                        <Link href="/guard/leave-request">
                            <i className="fa-solid fa-envelope-open-text"></i>Yêu Cầu Nghỉ Phép
                        </Link>
                    </li>
                    <li onClick={toggleView} className="dropdown-parent">
                        <i className="fa-solid fa-bars"></i>Theo Dõi
                        <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </li>
                    {viewOpen && (
                        <ul className="dropdown-children">
                            <li className={isActive('/guard/my-shifts')}>
                                <Link href="/guard/my-shifts">
                                    <i className="fa-solid fa-clock"></i>Lịch Sử Ca Trực
                                </Link>
                            </li>
                            <li className={isActive('/guard/absence-history')}>
                                <Link href="/guard/absence-history">
                                    <i className="fa-solid fa-calendar-xmark"></i>Lịch Sử Nghỉ Phép
                                </Link>
                            </li>
                            <li className={isActive('/guard/payroll')}>
                                <Link href="/guard/payroll">
                                    <i className="fa-solid fa-money-bill-wave"></i>Thống Kê Lương Tháng
                                </Link>
                            </li>
                        </ul>
                    )}
                </>
            )
        }

        if (user.role === 'MANAGER') {
            return (
                <>
                    <li className={isActive('/manager')}>
                        <Link href="/manager">
                            <i className="fa-solid fa-chart-simple"></i>Trang Chủ
                        </Link>
                    </li>
                    <li className={isActive('/manager/generate-shift')}>
                        <Link href="/manager/generate-shift">
                            <i className="fa-solid fa-calendar-plus"></i>Tạo Lịch Làm Việc
                        </Link>
                    </li>
                    <li className={isActive('/manager/approval')}>
                        <Link href="/manager/approval">
                            <i className="fa-solid fa-inbox"></i>Duyệt Nghỉ Phép
                        </Link>
                    </li>
                    <li className={isActive('/manager/rearrange')}>
                        <Link href="/manager/rearrange">
                            <i className="fa-solid fa-user-pen"></i>Phân Công Ca Trực Bù
                        </Link>
                    </li>
                    <li className={isActive('/manager/payroll')}>
                        <Link href="/manager/payroll">
                            <i className="fa-solid fa-file-invoice-dollar"></i>Bảng Lương
                        </Link>
                    </li>
                    {viewOpen && (
                        <ul className="dropdown-children">
                            <li className={isActive('/manager/absence-history')}>
                                <Link href="/manager/absence-history">
                                    <i className="fa-solid fa-user-clock"></i>Thống Kê Nghỉ Phép
                                </Link>
                            </li>
                            <li className={isActive('/manager/shift-history')}>
                                <Link href="/manager/shift-history">
                                    <i className="fa-solid fa-clock-rotate-left"></i>Thống Kê Ca Trực
                                </Link>
                            </li>
                        </ul>
                    )}
                </>
            )
        }

        if (user.role === 'ADMIN') {
            return (
                <>
                    <li className={isActive('/admin-guards')}>
                        <Link href="/admin-guards">
                            <i className="fa-solid fa-users-cog"></i>Bảo Vệ
                        </Link>
                    </li>
                    <li className={isActive('/admin-managers')}>
                        <Link href="/admin-managers">
                            <i className="fa-solid fa-user-tie"></i>Quản Lý
                        </Link>
                    </li>
                    <li className={isActive('/admin-locations')}>
                        <Link href="/admin-locations">
                            <i className="fa-solid fa-map-location-dot"></i>Khu Vực
                        </Link>
                    </li>
                    <li className={isActive('/admin-timeslots')}>
                        <Link href="/admin-timeslots">
                            <i className="fa-solid fa-hourglass-half"></i>Ca Trực
                        </Link>
                    </li>
                </>
            )
        }
    }

    return (
        <div className="sidebar">
            <h2>EIU - Vigilant</h2>
            <ul>
                {renderNavLinks()}
            </ul>
        </div>
    );
};

export default Sidebar;