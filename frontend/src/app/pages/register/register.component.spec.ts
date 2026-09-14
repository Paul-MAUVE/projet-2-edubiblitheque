import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        { provide: UserService, useClass: UserMockService },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not register when the form is invalid', () => {
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.registerForm.invalid).toBe(true);
  });

  it('should register a valid user and navigate to login', () => {
    const user = {
      firstName: 'Jean',
      lastName: 'Louche',
      login: 'test',
      password: 'password'
    };

    jest.spyOn(router, 'navigate');
    jest.spyOn(userService, 'register').mockReturnValue(of(user));

    component.registerForm.setValue(user);

    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith(user);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
