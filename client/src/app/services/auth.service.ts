import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: number | null = null;
  private role: string| null=null;
  // Set the user ID both in the service and localStorage
  setUserId(id: number) {
    this.userId = id;
    localStorage.setItem('userId', id.toString());+
0  }
  setUserRole(role: string) {
  this.role = role;
  localStorage.setItem('role', role);+
0  }
  // Get the user ID from the service or localStorage
  getUserId(): number | null {
    if (this.userId !== null) {
      return this.userId;
    }
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId !== null) {
      this.userId = parseInt(storedUserId, 10);
    }
    return this.userId;
  }
  getUserRole(): string | null {
    if(this.role!==null){
      return this.role;
    }
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole !== null) {
      this.userId = parseInt(storedUserRole, 10);
    }
    return this.role;
  }

  // Clear the user ID from the service and localStorage
  clearUserId() {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}
