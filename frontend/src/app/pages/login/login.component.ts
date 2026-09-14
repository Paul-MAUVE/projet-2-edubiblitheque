import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../core/service/auth.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLog: boolean = false

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    const loginUser: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
     this.authService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({
        next: (token: string) => {
        console.log('JWT reçu :', token);
        this.authService.saveToken(token);
        this.successMessage = 'Connexion réussie !';
        this.isLoading = false;
        this.isLog = true;
      },
        error: (error) => {
          // erreur
          console.error('Erreur de connexion :', error);
          this.errorMessage = 'Identifiant ou mot de passe incorrect.';
          this.isLoading = false;
        }
      })
    );
  }

  onReset(): void {
    this.submitted = false;
    this.isLoading = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.loginForm.reset();
  }
}
