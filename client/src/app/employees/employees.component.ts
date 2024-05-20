import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'] // Correct the property name to styleUrls
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  errorMessage: string = '';
  showAddForm: boolean = false; // Declare the showAddForm property here
  newEmployee: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.getEmployees().subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.errorMessage = 'Error fetching employees';
      }
    );
  };

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/auth/employees');
  };
  
  deleteEmployee(employeeId: number): void {
    this.http.post<any>('http://localhost:3000/auth/deleteemployee', {id:employeeId})
    .subscribe(
      (response) => {
        alert(response.message)
        this.loadEmployees();
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Failed to connect to the server'; // Display error message to the user
      }
        
    );
  };
  submitEmployee(): void {
    // Send HTTP POST request to add the new employee
    this.http.post<any>('http://localhost:3000/auth/addemployee', this.newEmployee)
      .subscribe(
        (response) => {
          console.log('Employee added successfully:', response);
          // Reset the form and hide it
          this.newEmployee = {};
          this.showAddForm = false;
          // Reload employees
          this.loadEmployees();
        },
        (error) => {
          console.error('Error adding employee:', error);
          this.errorMessage = 'Error adding employee';
        }
      );
  }
  addEmployee(): void {
    // Show the add employee form
    this.showAddForm = true;
  }
}
