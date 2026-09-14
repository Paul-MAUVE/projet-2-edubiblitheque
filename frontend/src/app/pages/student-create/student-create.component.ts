import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-create',
  imports: [CommonModule, MaterialModule,RouterLink],
  templateUrl: './student-create.component.html',
  standalone: true,
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);

  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  successMessage: string = '';
 
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
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
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value
    };

    this.studentService.createStudent(student).subscribe({
      next: (student) => {
        console.log('Étudiant créé :', student);
        this.successMessage = 'Étudiant créé avec succès !';
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