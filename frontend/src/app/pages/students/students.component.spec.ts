import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsComponent } from './students.component';
import { provideRouter } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let studentService: StudentService;
  let listStudents = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Louche'
    },
    {
      id: 2,
      firstName: 'Paul',
      lastName: 'Dupont'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsComponent],
      providers:[
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            getStudents: jest.fn().mockReturnValue(of(listStudents)),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    studentService = TestBed.inject(StudentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a list of all students', () => {
    expect(component.students).toEqual(listStudents);
  });

});
