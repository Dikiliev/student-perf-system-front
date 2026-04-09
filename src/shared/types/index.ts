export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse extends AuthTokens {
    user: User;
}

export interface Group {
    id: number;
    name: string;
    course: number;
    curator: number;
    curator_username: string;
    students_count: number;
    created_at: string;
}

export interface GroupRiskSummary {
    group_id: number;
    group_name: string;
    students_count: number;
    predicted_students_count: number;
    low_risk_count: number;
    medium_risk_count: number;
    high_risk_count: number;
}

export interface Subject {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';
export type StudentStatus = 'active' | 'graduated' | 'expelled' | 'academic_leave';

export interface Student {
    id: number;
    last_name: string;
    first_name: string;
    middle_name: string;
    full_name: string;
    record_book_number: string;
    group: number;
    group_name: string;
    email: string;
    enrollment_year: number;
    status: StudentStatus;
    current_risk_level: RiskLevel;
    current_risk_score: number;
    created_at: string;
    updated_at: string;
}

export type GradeType = 'exam' | 'test' | 'coursework' | 'practice' | 'regular';

export interface Grade {
    id: number;
    student: number;
    student_name: string;
    subject: number;
    subject_name: string;
    value: number;
    grade_type: GradeType;
    comment: string;
    graded_at: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface Attendance {
    id: number;
    student: number;
    student_name: string;
    subject: number;
    subject_name: string;
    lesson_date: string;
    status: AttendanceStatus;
    comment: string;
}

export interface Prediction {
    id: number;
    student: number;
    student_name: string;
    group_name: string;
    risk_score: number;
    risk_level: RiskLevel;
    average_grade: number;
    attendance_percent: number;
    missed_count: number;
    debt_count: number;
    factors: string[];
    recommendations: string[];
    created_by: number;
    created_at: string;
    updated_at: string;
}
