import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userId: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.autoAuthUser();
  }

  getToken(): string {
    return this.token;
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      this.token = token;  // Restore the token
      this.userId = userId;  // Restore the user ID
      this.authStatusListener.next(true);  // Notify all subscribers that the user is authenticated
    }
  }

  isAuth(): boolean {
    return !!this.token;
  }

  getUserId(): string {
    return this.userId;
  }

  getIsAuth(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = error.error.message || `Server returned code ${error.status}`;
    }
    return throwError(errorMessage);
  }

  createUser(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string, userId: string }>('http://localhost:3000/sign-up', { username, password }).pipe(
      tap(response => {
        this.token = response.token;
        this.userId = response.userId;
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.authStatusListener.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string, userId: string }>('http://localhost:3000/login', { username, password }).pipe(
      tap(response => {
        this.token = response.token;
        this.userId = response.userId;
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.authStatusListener.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    localStorage.clear();
  }
}
