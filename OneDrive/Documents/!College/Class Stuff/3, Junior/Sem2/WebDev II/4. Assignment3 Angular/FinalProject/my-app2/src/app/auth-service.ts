import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private userId: string;
  private username: string;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.autoAuthUser(); // Attempt to authenticate user automatically on service instantiation
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asObservable(); // Return as Observable for components to subscribe
  }

  signupUser(username: string, password: string) {
    const authData = { username, password };
    return this.http.post<{ message: string; result: any }>("http://localhost:3000/sign-up", authData)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.error.message || "Signup failed"));
        })
      );
  }

  loginUser(username: string, password: string) {
    const authData = { username, password };
    return this.http.post<{ token: string; userId: string; username: string }>("http://localhost:3000/login", authData)
      .pipe(
        tap((res) => {
          this.token = res.token;
          this.userId = res.userId;
          this.username = res.username;
          if (this.token) {
            this.isAuthenticated.next(true);
            this.saveAuthData(this.token, this.userId, this.username);
          }
        }),
        catchError((error) => {
          return throwError(() => new Error(error.error.message || "Login failed"));
        })
      );
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuthenticated.next(false);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private saveAuthData(token: string, userId: string, username: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (token && userId && username) {
      return { token, userId, username };
    }
    return null;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.isAuthenticated.next(true);
    }
  }
}
