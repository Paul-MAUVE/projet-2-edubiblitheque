import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const user = {
      login: 'test',
      password: 'password'
    };

    service.login(user).subscribe(response => {
      expect(response).toBe('fake-jwt-token');
    });

    const request = httpTestingController.expectOne('/api/login');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);

    request.flush('fake-jwt-token');
  });

  it('should save the token in localStorage', () => {
    const token = 'fake-jwt-token';

    service.saveToken(token);

    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should return the stored token', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    const token = service.getToken();

    expect(token).toBe('fake-jwt-token');
  });

});
