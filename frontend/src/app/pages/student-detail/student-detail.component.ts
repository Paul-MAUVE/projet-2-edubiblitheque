import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-detail',
  imports: [RouterLink],
  templateUrl: './student-detail.component.html',
  standalone: true,
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  student: Student | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’étudiant :', error);
      }
    });
    console.log('ID étudiant :', id);
  }

  onDelete(id : number): void{
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?');
    if (!confirmed) {
      return;
    }
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        console.log('Étudiant supprimé');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
      }
    });
  }
}