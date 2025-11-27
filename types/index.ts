export type UserRole = 'ADMIN' | 'MANAGER' | 'GUARD';

export interface AuthUser {
    username: string;
    fullName: string;
    role: UserRole;
    identityNumber?: string;
}

export interface GuardEntity {
    id: number;
    username: string;
    fullName: string;
    identityNumber: string;
    team: string;
    rotaGroup: string;
    role: 'GUARD';
    salaryPerHour?: number;
}

export interface Shift {
    id: number;
    shiftDate: string;
    timeSlot: string;
    location: string;
}

export interface GuardStats {
    totalDayShifts: number;
    totalNightShifts: number;
    weeklyShiftCounts: Record<string, number>;
    monthlyAbsenceCounts: Record<string, number>;
}

export interface LeaveRequestSimple {
    id: number;
    guardName: string;
    startDate: string;
}

export interface ManagerStats {
    presentCount: number;
    lateCount: number;
    absenceCount: number;
    assignedShifts: number;
    openShifts: number;
    upcomingLeaves: LeaveRequestSimple[];
}