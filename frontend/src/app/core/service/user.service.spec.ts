import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

   it('should register a user', () => {
    const user = {
      firstName: 'Jean',
      lastName: 'Louche',
      login: 'test',
      password: 'password'
    };

    service.register(user).subscribe(response => {
      expect(response).toEqual(user);
    });

    const request = httpTestingController.expectOne('/api/register');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);

    request.flush(user);
  });

});
