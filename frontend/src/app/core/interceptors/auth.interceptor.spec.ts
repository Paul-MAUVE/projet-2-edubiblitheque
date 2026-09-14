import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authService: AuthService;
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({ 
      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn().mockReturnValue('fake-jwt-token')
          }
        }
      ]
    });

    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add the Authorization header when a token exists', () => {
    const req = new HttpRequest('GET', '/api/students');
    const next = jest.fn();

    interceptor(req, next);
    
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer fake-jwt-token');
  });
});
