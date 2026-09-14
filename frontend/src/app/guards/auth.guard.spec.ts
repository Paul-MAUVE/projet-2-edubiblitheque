import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { authGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthService;
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn().mockReturnValue('fake-jwt-token')
          }
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn().mockReturnValue('/login')
          }
        }
      ]
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when a token exists', () => {
    const result = executeGuard(null as any, null as any);

    expect(result).toBe(true);
  });

  it('should redirect to login when no token exists', () => {
    const authService = TestBed.inject(AuthService);

    jest.spyOn(authService, 'getToken').mockReturnValue(null);

    const result = executeGuard(null as any, null as any);

    expect(result).toBe('/login');
  });
});
