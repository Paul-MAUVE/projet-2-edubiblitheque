import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentCreateComponent } from './student-create.component';
import { provideRouter, Router } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentCreateComponent', () => {
  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;
  let router: Router;
  let studentService: StudentService;
  let aStudent =
    {
      firstName: 'Jean',
      lastName: 'Louche'
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCreateComponent],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            createStudent: jest.fn().mockReturnValue(of(aStudent)),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    studentService = TestBed.inject(StudentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create a student when the form is invalid', () => {
  
    component.onSubmit();

    expect(component.studentForm.invalid).toBe(true);
    expect(component.submitted).toBe(false);
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  it('should create a student', () => {
  
    component.studentForm.setValue(aStudent);
  
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(studentService.createStudent).toHaveBeenCalledWith(aStudent);
    expect(component.successMessage).toBe('Étudiant créé avec succès !');
  });

});
