import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  imports: [RouterLink],
  templateUrl: './students.component.html',
  standalone: true,
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  private studentService = inject(StudentService);

  students: Student[] = [];

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des étudiants :', error);
      }
    });
  }
}