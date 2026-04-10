import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/shared/api/api';
import type { Student, Grade, Attendance, Prediction } from '@/shared/types';
import type { RootStore } from './RootStore';

export class StudentsStore {
    rootStore: RootStore;

    students: Student[] = [];
    selectedStudent: Student | null = null;
    studentGrades: Grade[] = [];
    studentAttendance: Attendance[] = [];
    studentPrediction: Prediction | null = null;

    isLoading = false;
    isDetailsLoading = false;

    filters = {
        search: '',
        group: '',
        status: '',
    };

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setFilters(filters: Partial<typeof this.filters>) {
        this.filters = { ...this.filters, ...filters };
    }

    clearFilters() {
        this.filters = { search: '', group: '', status: '' };
    }

    async fetchStudents() {
        this.isLoading = true;
        try {
            const params = new URLSearchParams();
            if (this.filters.group) params.append('group', this.filters.group);
            if (this.filters.status) params.append('status', this.filters.status);
            if (this.filters.search) params.append('search', this.filters.search);

            const response = await api.get(`/api/students/?${params.toString()}`);
            runInAction(() => {
                this.students = response.data;
            });
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async fetchStudentDetails(id: number) {
        this.isDetailsLoading = true;
        try {
            const [studentRes, gradesRes, attendanceRes, predictionsRes] = await Promise.all([
                api.get(`/api/students/${id}/`),
                api.get(`/api/grades/?student=${id}`),
                api.get(`/api/attendance/?student=${id}`),
                api.get(`/api/predictions/?student=${id}`), // backend might need this filter or we find it
            ]);

            runInAction(() => {
                this.selectedStudent = studentRes.data;
                this.studentGrades = gradesRes.data;
                this.studentAttendance = attendanceRes.data;

                const preds = predictionsRes.data;
                // In case predictions return a list, pick the first connected one
                this.studentPrediction = Array.isArray(preds) && preds.length > 0 ? preds[0] : null;
            });
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => {
                this.isDetailsLoading = false;
            });
        }
    }

    async recalculatePrediction(id: number) {
        try {
            const response = await api.post(`/api/students/${id}/predict/`);
            runInAction(() => {
                this.studentPrediction = response.data;
                // Update the student in the list if they are there
                const index = this.students.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.students[index].current_risk_score = response.data.risk_score;
                    this.students[index].current_risk_level = response.data.risk_level;
                }
                if (this.selectedStudent && this.selectedStudent.id === id) {
                    this.selectedStudent.current_risk_score = response.data.risk_score;
                    this.selectedStudent.current_risk_level = response.data.risk_level;
                }
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async recalculateAll() {
        try {
            const response = await api.post('/api/students/predict-all/');
            // Refresh students after recalculation
            await this.fetchStudents();
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async createStudent(studentData: any) {
        try {
            const response = await api.post('/api/students/', studentData);
            runInAction(() => {
                this.students.unshift(response.data);
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async addGrade(data: { student: number, subject: number, value: number, grade_type: string, graded_at: string, comment?: string }) {
        try {
            const response = await api.post('/api/grades/', data);
            runInAction(() => {
                this.studentGrades.unshift(response.data);
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async addAttendance(data: { student: number, subject: number, lesson_date: string, status: string, comment?: string }) {
        try {
            const response = await api.post('/api/attendance/', data);
            runInAction(() => {
                this.studentAttendance.unshift(response.data);
            });
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
