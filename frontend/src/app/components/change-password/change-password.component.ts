import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  user: any = {};
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  loadUser(): void {
    this.userService.getUser().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load user data';
      }
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
      
      this.authService.changePassword(currentPassword, newPassword, confirmPassword).subscribe({
        next: (response) => {
          this.success = response.message;
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.error || 'Failed to update password. Please try again.';
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  validateAllFormFields() {
    Object.keys(this.passwordForm.controls).forEach(field => {
      const control = this.passwordForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  logout() {
    this.authService.logout();
  }
}