'use client'

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Chart as ChartJS,
        ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TitleContext } from '@/context/TitleContext';
import { useAuth } from '@/context/AuthContext';
import ShiftCalendar from '@/components/ShiftCalendar';
import { Shift, GuardStats } from '@/types';
import './GuardHomePage.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const GuardHomePage = () => {
    const { setTitle } = useContext(TitleContext);
    const { user } = useAuth();
    const [calendarShifts, setCalendarShifts] = useState<Shift[]>([]);
    const [stats, setStats] = useState<GuardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');

        const fetchData = async () => {
            try {
                const [shiftsRes, statsRes] = await Promise.all([
                    axios.get<Shift[]>("/api/shifts/calendar"),
                    axios.get<GuardStats>("/api/dashboard/guard")
                ]);

                setCalendarShifts(shiftsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu dashboard: " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setTitle]);

    const pieData = stats ? {
        labels: ['Ca Sáng', 'Ca Tối'],
        datasets: [{
            data: [stats.totalDayShifts, stats.totalNightShifts],
            backgroundColor: ['#FFCE56', '#2196F3'],
            borderWidth: 1,
        }],
    } : null;

    const barData = stats ? {
        labels: Object.keys(stats.weeklyShiftCounts),
        datasets: [{
            label: 'Số ca đã nhận',
            data: Object.values(stats.weeklyShiftCounts),
            backgroundColor: ['#f32144'],
        }],
    } : null;

    if(loading) return <div className="loading-container">Đang tải dữ liệu...</div>;

    return (
        <div className="guard-home-page">
            {user && (
                <>
                    <h3>Xin chào, {user.fullName}!</h3>
                    {user.identityNumber && <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>}
                </>
            )}
            
            <div className="dashboard-layout">
                <div className="calendar-box">
                    <h4>Lịch trực tháng này:</h4>
                    <ShiftCalendar shiftData={calendarShifts} />
                </div>

                <div className="charts-box">
                    {stats && pieData && barData && (
                        <>
                            <div className="card">
                                <h4>Thống kê ca trực (Tháng này)</h4>
                                <div className="chart-tall">
                                    <Pie data={pieData} />
                                </div>
                            </div>
                            <div className="card">
                                <h4>Số ca theo tuần</h4>
                                <div className="chart-tall">
                                    <Bar data={barData} options={{ maintainAspectRatio: false }}/>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GuardHomePage;