import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stock: any[] = [];
  employees: any[] = [];
  errorMessage: string = '';
  outputMessage: string='';
  userId: number | null = null;
  role: string | null = null;
  warehouse: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.role = this.authService.getUserRole();
    if (this.userId !== null) {
      this.loadInitialData();
    } else {
      this.errorMessage = 'User ID is null';
      console.error('User ID is null');
    }
  }

  loadInitialData(): void {
    forkJoin({
      warehouse: this.loadEmployees(),
      stock: this.getStock()
    }).subscribe(
      ({ warehouse, stock }) => {
        this.warehouse = warehouse;
        if (this.role === 'Admin') {
          this.stock = stock;
          this.outputMessage="Admin"
        } else if (this.role === 'Manager' || this.role === 'Worker') {        
          const warehouseItem = stock.find(item => item.warehouse === Number(this.warehouse));
          this.stock = warehouseItem ? warehouseItem.stock : [];
          console.log(warehouseItem)
          this.outputMessage="Manager"
          this.stock = stock;
        }
      },
      (error) => {
        console.error('Error loading initial data:', error);
        this.errorMessage = 'Error loading initial data';
      }
    );
  }
  

  loadEmployees(): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      this.http.post<any>('http://localhost:3000/auth/profile', { id: this.userId })
        .subscribe(
          (response) => {
            if (response && response.message === 'Retrieval successful') {
              observer.next(response.userdetails.warehouse);
              observer.complete();
            } else {
              this.errorMessage = 'Unexpected response from the server';
              console.error('Unexpected response from the server:', response);
              observer.error('Unexpected response from the server');
            }
          },
          (error) => {
            console.error('Retrieval failed:', error);
            this.errorMessage = 'Failed to connect to the server';
            observer.error('Failed to connect to the server');
          }
        );
    });
  }

  getStock(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/auth/stock');
  }
}
