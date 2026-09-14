import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import { CreateStudent } from '../models/CreateStudent';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>('/api/students');
  }

  getStudent(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/students/${id}`);
  }

  createStudent(student: CreateStudent): Observable<Student> {
    return this.httpClient.post<Student>('/api/students', student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.httpClient.put<Student>(`/api/students/${student.id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/students/${id}`);
  }
}