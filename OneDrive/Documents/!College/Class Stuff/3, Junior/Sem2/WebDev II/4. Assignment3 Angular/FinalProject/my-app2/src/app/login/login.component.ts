import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.authService.loginUser(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: () => {
          console.log("Logged in successfully");
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
  }
}
