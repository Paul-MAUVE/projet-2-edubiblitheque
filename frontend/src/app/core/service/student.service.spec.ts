import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all students', () => {
    
    const students = [
    { id: 1, firstName: 'Jean', lastName: 'Louche' },
    { id: 2, firstName: 'Paul', lastName: 'Dupont' }
    ];

    service.getStudents().subscribe();

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('GET');

    request.flush(students);
  });

  it('should get a student by its ID', () => {
    
    const student = { id: 1, firstName: 'Jean', lastName: 'Louche' };

    service.getStudent(student.id).subscribe();

    const request = httpTestingController.expectOne('/api/students/' + student.id);

    expect(request.request.method).toBe('GET');

    request.flush(student);
  });

  it('should create a student', () => {
    
    const student = { firstName: 'Jean', lastName: 'Louche' };

    service.createStudent(student).subscribe();

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);

    request.flush(student);
  });

  it('should update a student by its ID', () => {
    
    const student = { id: 1, firstName: 'Jean', lastName: 'Lache' };

    service.updateStudent(student).subscribe();

    const request = httpTestingController.expectOne('/api/students/' + student.id);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(student);

    request.flush(student);
  });

  it('should delete a student by its ID', () => {
    
    const student = { id: 1, firstName: 'Jean', lastName: 'Louche' };

    service.deleteStudent(student.id).subscribe();

    const request = httpTestingController.expectOne('/api/students/' + student.id);

    expect(request.request.method).toBe('DELETE');

    request.flush('');
  });

});
