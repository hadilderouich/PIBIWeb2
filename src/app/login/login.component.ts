import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validate input fields
    if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }
    if (!this.validatePassword(this.password)) {
      this.passwordError = 'Password must be at least 8 characters long.';
      return;
    }

    const credentials = {
      email: this.email.toLowerCase(),
      password: this.password
    };

    this.authService.login(credentials).subscribe(response => {
      if (response.success) {
        // Navigate to the appropriate dashboard
        this.router.navigate(['/dashboard', response.dashboard]);
      } else {
        this.error = response.message;
      }
    }, error => {
      console.error('Login error:', error);
      if (error.status === 0) {
        this.error = 'Could not connect to the server. Please check if the backend is running.';
      } else if (error.status === 401) {
        this.error = 'Invalid credentials. Please check your email and password.';
      } else {
        this.error = 'An error occurred during login. Please try again.';
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }
}
