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