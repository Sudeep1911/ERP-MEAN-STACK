import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  errorMessage: string = '';
  user: any = { // Combined object to store user and login details
    userDetails: null,
    loginDetails: null
  };
  isEditMode: boolean = false; // Variable to toggle edit mode

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Retrieve the user ID from the service

    if (this.userId !== null) { // Check if the user ID is not null
      // Make an HTTP request to retrieve data using this.userId
      this.http.post<any>('http://localhost:3000/auth/profile', { id: this.userId })
        .subscribe(
          (response) => {
            if (response && response.message === 'Retrieval successful') {
              this.user.userDetails = response.userdetails; // Store the user details
              this.user.loginDetails = response.logindetails;
            } else {
              this.errorMessage = 'Unexpected response from the server';
              console.error('Unexpected response from the server:', response);
            }
          },
          (error) => {
            console.error('Retrieval failed:', error);
            this.errorMessage = 'Failed to connect to the server';
          }
        );
    } else {
      this.errorMessage = 'User ID is null';
      console.error('User ID is null');
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
  onSubmit(): void {
    if (this.user.userDetails && this.isEditMode) {
      console.log(this.user)
      this.http.post<any>('http://localhost:3000/auth/updateprofile', this.user)
        .subscribe(
          (response) => {
            if (response && response.message === 'Update successful') {
              console.log('Update successful:', response);
              this.isEditMode = false; // Exit edit mode after successful save
            } else {
              this.errorMessage = 'Unexpected response from the server';
              console.error('Unexpected response from the server:', response);
            }
          },
          (error) => {
            console.error('Update failed:', error);
            this.errorMessage = 'Failed to update the profile';
          }
        );
    }
  }
}