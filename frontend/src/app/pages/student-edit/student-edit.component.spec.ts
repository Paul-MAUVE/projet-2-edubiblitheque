import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { StudentEditComponent } from './student-edit.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentEditComponent', () => {
  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;
  let studentService: StudentService;
  let aStudent =
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Louche'
    };
  let aStudentModified =
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Lache'
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEditComponent],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            getStudent: jest.fn().mockReturnValue(of(aStudent)),
            updateStudent: jest.fn().mockReturnValue(of(aStudentModified)),
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1')
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    studentService = TestBed.inject(StudentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a student in form', () => {
    expect(component.studentForm.value).toEqual({
      firstName: aStudent.firstName,
      lastName: aStudent.lastName
    });
  });
  
  it('should not update a student when the form is invalid', () => {
  
    component.studentForm.reset();
    component.onSubmit();

    expect(component.studentForm.invalid).toBe(true);
    expect(component.submitted).toBe(false);
    expect(studentService.updateStudent).not.toHaveBeenCalled();
  });

  it('should update a student by its ID', () => {
    
    component.studentForm.setValue({
      firstName: aStudentModified.firstName,
      lastName: aStudentModified.lastName
    });

    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(studentService.updateStudent).toHaveBeenCalledWith(aStudentModified);
    expect(component.successMessage).toBe('Étudiant modifié avec succès !');

  });
  
});
