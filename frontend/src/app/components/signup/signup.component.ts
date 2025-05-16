import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  error: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      lastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      street: ['', [Validators.required, Validators.pattern(/\S+/)]],
      city: ['', [Validators.required, Validators.pattern(/\S+/)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{3}$/)]],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      const form = this.signupForm.value;

      if (form.password !== form.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        },
      };

      this.authService.signUp(userData).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (err) => {
        this.error = err.error?.message || 'Signup failed. Try again.';
      }
    });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  closeAlert(): void {
    this.error = null;
  }
}
