'use client'

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { parseISO } from 'date-fns';

import { TitleContext } from '@/context/TitleContext';
import { ManagerStats } from '@/types';
import './ManagerHomePage.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const ManagerHomePage = () => {
    const { setTitle } = useContext(TitleContext);
    const [stats, setStats] = useState<ManagerStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setTitle('Trang Chủ Quản Lý');

        const fetchDashboardData = async () => {
            try {
                const res = await axios.get<ManagerStats>("/api/dashboard/manager");
                setStats(res.data);
            } catch (err) {
                console.error("Lỗi khi tải dashboard quản lý: ", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [setTitle]);

    const pieData = {
        labels: ['Đúng giờ', 'Đi trễ', 'Vắng mặt'],
        datasets: [
            {
                data: [
                    stats?.presentCount || 0,
                    stats?.lateCount || 0,
                    stats?.absenceCount || 0
                ],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Tuần này'],
        datasets: [
            {
                label: 'Đã phân ca',
                data: [stats?.assignedShifts || 0],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Ca trống (Cần gán)',
                data: [stats?.openShifts || 0],
                backgroundColor: '#FF6384',
            },
        ],
    };

    if (isLoading) return <div style={{ padding: 25 }}>Đang tải dữ liệu tổng quan...</div>

    return (
        <div className="manager-home-page">
            <div className="dashboard-grid">
                <div className="card">
                    <h4>Thống kê chuyên cần (Tháng này)</h4>
                    <div className="chart-container">
                        {(stats && (stats.presentCount + stats.lateCount + stats.absenceCount) > 0) ? (
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-muted text-center mt-4">Chưa có dữ liệu chấm công tháng này.</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h4>Tình trạng phân ca (Tuần này)</h4>
                    <div className="chart-tall">
                        <Bar
                            data={barData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="card">
                    <h4>Đơn nghỉ cần duyệt</h4>
                    {stats?.upcomingLeaves && stats.upcomingLeaves.length > 0 ? (
                        <ul className="leave-list">
                            {stats.upcomingLeaves.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.guardName}</strong>
                                    <br />
                                    <span className="text-muted">
                                        Ngày nghỉ: {parseISO(item.startDate).toLocaleDateString('vi-VN')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted text-center" style={{ marginTop: '20px' }}>
                            Không có đơn nghỉ nào mới.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagerHomePage;