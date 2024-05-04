import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.authService.signupUser(this.signupForm.value.username, this.signupForm.value.password)
      .subscribe({
        next: (res) => {
          console.log('Signup successful', res);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
  }
}
