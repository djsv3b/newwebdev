import { HttpClient } from "@angular/common/http";
//import { expressionType } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthModel } from "./auth-model";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { switchMap } from "rxjs/operators";


@Injectable({providedIn:"root"})
export class AuthService{
    private currentUserId: string;
    private username: string;
    private token: string;
    private authenticatedSub = new Subject<boolean>();
    private isAuthenticated = false;
    private logoutTimer: any;

    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    getAuthenticatedSub(){
        return this.authenticatedSub.asObservable();
    }
    getToken(){
        return this.token;
    }
    
    constructor(private http: HttpClient, private router: Router){}
    
    signupUser(username: string, password: string) {
        const authData: AuthModel = { username, password };
        return this.http.post<{message: string, result: any}>('http://localhost:3000/sign-up/', authData).pipe(
          switchMap(() => {
            return this.loginUser(username, password);
          }),
          catchError(error => {
            return throwError(() => new Error(error.error.message || 'Signup failed'));
          })
        );
      }
    
      loginUser(username: string, password: string) {
        const authData = { username, password };
        return this.http.post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/login/', authData).pipe(
          tap(res => {
            this.token = res.token;
            if (this.token) {
              this.isAuthenticated = true;
              this.authenticatedSub.next(true);
              this.storeLoginDetails(res.token, new Date(new Date().getTime() + res.expiresIn * 1000), res.userId);
              this.router.navigate(['/']);
            }
          }),
          catchError(error => {
            return throwError(() => new Error(error.error.message || 'Login failed'));
          })
        );
      }
      
      private storeLoginDetails(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString());
        localStorage.setItem('userId', userId); // Store user ID
      }

    private setLogoutTimer(expiresIn: number) {
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, expiresIn * 1000);
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authenticatedSub.next(false);
        clearTimeout(this.logoutTimer);
        this.clearLoginDetails();
        this.router.navigate(['/login']);
    }

    private clearLoginDetails() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }

    getLocalStorageData(){
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        if(!token || !expiresIn){
            return;
        }
        return {
            'token': token,
            'expiresIn': new Date(expiresIn)
        }
    }

    authenticateFromLocalStorage() {
      const token = localStorage.getItem('token');
      const expiresIn = localStorage.getItem('expiresIn');
      const userId = localStorage.getItem('userId');
    
      if (!token || !expiresIn || !userId) {
        return;
      }
      
      const expirationDate = new Date(expiresIn);
      if (expirationDate.getTime() - new Date().getTime() > 0) {
        this.token = token;
        this.currentUserId = userId;
        this.isAuthenticated = true;
        this.authenticatedSub.next(true);
        this.setLogoutTimer((expirationDate.getTime() - new Date().getTime()) / 1000);
      }
    }

    setUserId(userId: string) {
      this.currentUserId = userId;
    }
  
    getUserId(): string {
      return localStorage.getItem('userId');
    }

    
    
}