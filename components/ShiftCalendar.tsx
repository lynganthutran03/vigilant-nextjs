'use client'

import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Shift } from '@/types';
import './ShiftCalendar.css';

const CalendarComponent = FullCalendar as any;

interface ShiftCalendarProps {
    shiftData: Shift[];
}

const ShiftCalendar = ({ shiftData }: ShiftCalendarProps) => {
    const getTimeRange = (slot: string) => {
        switch (slot) {
            case "DAY_SHIFT": return "07:30 - 14:30";
            case "NIGHT_SHIFT": return "14h30 - 21h30";
            default: return "";
        };
    };

    const formatBlock = (location: string) => {
        if (!location) return "No Location";
        return location.replace("BLOCK_", "Block ").replace("GATE_ ", "Gate ");
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="fc-event-inner">
                <b>{eventInfo.timeText}</b>
                <i>{formatBlock(eventInfo.event.extendedProps.location)}</i>
            </div>
        );
    };

    const handleEventMount = (info: any) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'fc-tooltip';
        tooltip.innerHTML = `
            <strong>Ca:</strong> ${info.event.extendedProps.timeSlot}<br/>
            <strong>Giờ:</strong> ${getTimeRange(info.event.extendedProps.timeSlot)}<br/>
            <strong>Khu vực:</strong> ${formatBlock(info.event.extendedProps.location)}
        `;
        document.body.appendChild(tooltip);

        const showTooltip = (e: MouseEvent) => {
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        };

        const moveTooltip = (e: MouseEvent) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        }

        const hideTooltip = () => {
            tooltip.style.display = 'none';
        }

        info.el.addEventListener('mouseenter', showTooltip);
        info.el.addEventListener('mousemove', moveTooltip);
        info.el.addEventListener('mouseleave', hideTooltip);

        return () => {
            info.el.removeEventListener('mouseenter', showTooltip);
            info.el.removeEventListener('mousemove', moveTooltip);
            info.el.removeEventListener('mouseleave', hideTooltip);
            tooltip.remove();
        }
    };

    return (
        <CalendarComponent
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="vi"
            height="auto"
            events={shiftData.map(shift => ({
                title: `${shift.timeSlot} - ${shift.location}`,
                start: shift.shiftDate,
                color: shift.timeSlot === "DAY_SHIFT" ? "#FFCE56" : "#2196F3",
                extendedProps: {
                    location: shift.location,
                    timeSlot: shift.timeSlot,
                }
            }))}
            eventContent={renderEventContent}
            eventDidMount={handleEventMount}
        />
    );
};

export default ShiftCalendar;