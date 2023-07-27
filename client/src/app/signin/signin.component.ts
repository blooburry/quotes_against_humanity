import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'api/user.service';
import { Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { PasswordIncorrectError, UserNotFoundError } from 'common/types';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  protected form!: FormGroup;

  protected pendingSubmission = false;
  protected userNotFound = false;
  protected passwordIncorrect = false;
  protected differentErrorMessage = '';

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
  ){ }

  ngOnInit() {
    this.form = this.builder.group({
      username: new FormControl('', {
        validators: [
          Validators.required,
        ]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
        ]
      })
    })
  }

  onSubmit() {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;

    this.userNotFound = false;
    this.passwordIncorrect = false;

    this.pendingSubmission = true;

    this.userService.signIn({
      username,
      password,
    })
    .subscribe((tokens) => {
      this.pendingSubmission = false;

      console.log(`User ${username} was successfully signed in`);

      localStorage.setItem('session', JSON.stringify({
        username,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }));
    },
    (error: Error) => {
      this.pendingSubmission = false;

      if(error instanceof UserNotFoundError) this.userNotFound = true;
      else if(error instanceof PasswordIncorrectError) this.passwordIncorrect = true;
      
      // credentials are correct
      if(!this.userNotFound && !this.passwordIncorrect) alert(error.message);
    })
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

}
