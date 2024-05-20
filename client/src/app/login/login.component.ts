import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'client';
  loginForm = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.http.post<any>('http://localhost:3000/auth/login', this.loginForm)
      .subscribe(
        (response) => {
          if (response && response.message === 'Login successful') {
            console.log('Login successful:', response);
            this.authService.setUserId(response.id);
            this.authService.setUserRole(response.role);
            this.router.navigateByUrl('/dashboard');
          } else if (response && response.message === 'Invalid password') {
            this.errorMessage = 'Invalid password'; // Display error message to the user
          }else if (response && response.message === 'User not found') {
            this.errorMessage = 'User not found'; // Display error message to the user
          }else {
            this.errorMessage = 'Unexpected response from the server'; // Display error message to the user
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Failed to connect to the server'; // Display error message to the user
        }
        
      );
  }
}
