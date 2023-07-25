import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validators, ValidatorFn, AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms';
import { UserService } from '../user.service';
import { Observable, map, of, debounceTime, take, switchMap, tap, interval } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  form!: FormGroup;
  invalidSubmitAttempt = false;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private usernameValidator: UniqueUsernameValidator,
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(4),
        ],
        asyncValidators: [
          this.usernameValidator.validate.bind(this.usernameValidator)
        ]        
      }),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{6,}'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, {
      validators: this.passwordMatchValidator
    });

    // this.inspect();
  }

  inspect(){
    interval(5000).subscribe(() => {
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = this.form.get(key)!.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    })
  }

  onSubmit() {
    // we can assume the form is valid at this point
    

    // Form is valid, proceed with signup process
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;

    // API call
    this.userService.signUp({
      username,
      password, // this isn't actually hashed yet, the server does that
    }).subscribe((u) => {
      console.log(`User ${JSON.stringify(u)} was successfully signed up`)
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null :
      {
        passwordDoesNotMatch: { value: `${password} does not match ${confirmPassword}` }
      }
  };
  
  // getters for the HTML validation
  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}

@Injectable({providedIn: 'root'})
class UniqueUsernameValidator implements AsyncValidator {

  constructor(
    private userService: UserService,
  ){}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      tap(() => console.log('change detected')),
      debounceTime(300),
      take(1),
      tap(() => console.log("async validator was called")),
      switchMap((username: string): Observable<{ exists: boolean }> => this.userService.checkIfUsernameExists(username)),
      map((b: { exists: boolean }) => b.exists ?
        {
          usernameTaken: { value: `Username was already taken!` }
        }
        :
        null
      )
    );
  };
}