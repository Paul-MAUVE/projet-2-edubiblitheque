import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-edit',
  imports: [CommonModule, MaterialModule,RouterLink],
  templateUrl: './student-edit.component.html',
  standalone: true,
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent {
  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);

  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  successMessage: string = '';

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log('ID étudiant à modifier :', id);

    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        console.log('Étudiant récupéré :', student);
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’étudiant :', error);
      }
    });
  }
  
  get form() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
   
    if (this.studentForm.invalid) {
      return;
    }

    this.submitted = true;

    const student = {
      id: Number(this.route.snapshot.paramMap.get('id')),
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value
    };

    this.studentService.updateStudent(student).subscribe({
      next: (student) => {
        console.log('Étudiant modifié :', student);
        this.successMessage = 'Étudiant modifié avec succès !';
      },
      error: (error) => {
        console.error('Erreur lors de la création de l’étudiant :', error);
        this.successMessage = 'Erreur lors de la création de l’étudiant :', error;
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.studentForm.reset();
  }
}
