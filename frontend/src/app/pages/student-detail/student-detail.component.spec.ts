import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentDetailComponent } from './student-detail.component';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let router: Router;
  let studentService: StudentService;
  let aStudent =
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Louche'
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            getStudent: jest.fn().mockReturnValue(of(aStudent)),
            deleteStudent: jest.fn().mockReturnValue(of('')),
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(aStudent.id)
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    studentService = TestBed.inject(StudentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a students by its ID', () => {
    expect(component.student).toEqual(aStudent);
  });

  it('should cancel delete', () => {
    jest.spyOn(window,'confirm').mockReturnValue(false);

    component.onDelete(aStudent.id);

    expect(studentService.deleteStudent).not.toHaveBeenCalled();
  });

  it('should delete a student by its ID', () => {
    jest.spyOn(window,'confirm').mockReturnValue(true);
    jest.spyOn(router, 'navigate');

    component.onDelete(aStudent.id);

    expect(studentService.deleteStudent).toHaveBeenCalledWith(aStudent.id);
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
