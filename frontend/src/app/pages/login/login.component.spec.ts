import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers : [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            saveToken: jest.fn()
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not login when the form is invalid', () => {
  
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login successfully', () => {
    const token = 'fake-jwt-token';

    jest.spyOn(authService, 'login').mockReturnValue(of(token));

    component.loginForm.setValue({
      login: 'test',
      password: 'password'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      login: 'test',
      password: 'password'
    });

    expect(authService.saveToken).toHaveBeenCalledWith(token);
    expect(component.successMessage).toBe('Connexion réussie !');
    expect(component.isLoading).toBe(false);
    expect(component.isLog).toBe(true);
  });
});
