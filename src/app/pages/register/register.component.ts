import { Component, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
  AsyncValidatorFn
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { CreateUser, UserData } from '../../interfaces/UserInterfaces';
import { UsersService } from '../../services/users.service';
import { from, Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  usersService = inject(UsersService);
  registerForm: FormGroup<CreateUser | any>;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  formError: boolean = false;
  requestSuccess: boolean = false;
  formErrorText: string = '';
  isCheckingUsername: boolean = false;
  isCheckingEmail: boolean = false;
  readonly USERNAME = /^[a-zA-Z0-9_-]{3,20}$/;
  readonly EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly PHONE = /^\d{10}$/;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(this.USERNAME)
        ],
        asyncValidators: [this.usernameValidator()]
      }),
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      birth_date: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]),
      confirm_password: new FormControl('', [
        Validators.required
      ]),
      institution: new FormControl('', [
        Validators.required
      ]),
      campus: new FormControl('', [
        Validators.required
      ]),
      student_carreer: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(this.EMAIL)
        ],
        asyncValidators: [this.emailValidator()]
      }),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(this.PHONE)
      ]),
    }, { validators: this.passwordMatchValidator });
    
    this.registerForm.get('username')?.statusChanges.pipe(
      distinctUntilChanged()
    ).subscribe(status => {
      this.isCheckingUsername = status === 'PENDING';
    });
    
    this.registerForm.get('email')?.statusChanges.pipe(
      distinctUntilChanged()
    ).subscribe(status => {
      this.isCheckingEmail = status === 'PENDING';
    });
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      
      if (!value || !this.USERNAME.test(value)) {
        return of(null);
      }
      
      return of(value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(username => {
          return from(this.usersService.verifyUsername(username)).pipe(
            map(isAvailable => isAvailable ? null : { usernameExists: true }),
            catchError(() => of({ usernameExists: true }))
          );
        })
      );
    };
  }
  
  
  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      
      if (!value || !this.EMAIL.test(value)) {
        return of(null);
      }
      
      return of(value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => {
          return from(this.usersService.verifyEmail(email)).pipe(
            map(isAvailable => isAvailable ? null : { emailExists: true }),
            catchError(() => of({ emailExists: true }))
          );
        })
      );
    };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;

    if (password !== confirmPassword && confirmPassword !== '') {
      control.get('confirm_password')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `No puede tener más de ${requiredLength} caracteres`;
    }

    if (errors['pattern']) {
      switch (controlName) {
        case 'username':
          return 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos';
        case 'email':
          return 'Ingrese un correo electrónico válido';
        case 'phone':
          return 'El teléfono debe tener 10 dígitos numéricos';
        default:
          return 'Formato inválido';
      }
    }

    if (errors['passwordStrength']) {
      return 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales';
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    
    if (errors['usernameExists']) {
      return 'Este nombre de usuario ya está en uso';
    }
    
    if (errors['emailExists']) {
      return 'Este correo electrónico ya está registrado';
    }
    if (errors['usernameExists']) {
      return 'Este nombre de usuario ya está en uso. Por favor elige otro.';
    }
    
    if (errors['emailExists']) {
      return 'Este correo electrónico ya está registrado. ¿Has olvidado tu contraseña?';
    }
  
    return 'Campo inválido';
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  getInputClass(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) {
      return 'form-control bg-orange';
    }
    
    if (control.pending) {
      return 'form-control bg-orange is-pending';
    }
    
    return control.valid ? 'form-control bg-orange is-valid' : 'form-control bg-orange is-invalid';
  }

  async register() {
    this.isLoading = true;
    this.formError = false;
    this.requestSuccess = false;
    
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
    
    if (this.registerForm.pending) {
      setTimeout(() => this.register(), 500);
      return;
    }
    
    if (this.registerForm.invalid) {
      this.isLoading = false;
      this.formError = true;
      this.formErrorText = 'Por favor, corrija los errores en el formulario antes de continuar.';
      return;
    }
  
    try {
      const usernameIsAvailable = await this.usersService.verifyUsername(this.registerForm.value.username);
      const emailIsAvailable = await this.usersService.verifyEmail(this.registerForm.value.email);
      
      if (!usernameIsAvailable) {
        this.registerForm.get('username')?.setErrors({ usernameExists: true });
        throw new Error('El nombre de usuario ya está en uso');
      }
      
      if (!emailIsAvailable) {
        this.registerForm.get('email')?.setErrors({ emailExists: true });
        throw new Error('El correo electrónico ya está registrado');
      }
      
      const formData = { ...this.registerForm.value };
      delete formData.confirm_password;
      
      const response = await this.usersService.registerUser(formData);
  
      if (response) {
        this.requestSuccess = true;
        this.registerForm.reset();
      } else {
        this.formError = true;
        this.formErrorText = 'Ocurrió un error, por favor intente nuevamente.';
      }
      const usernameAvailable = await this.usersService.verifyUsername(this.registerForm.value.username);
    const emailAvailable = await this.usersService.verifyEmail(this.registerForm.value.email);
    
    if (!usernameAvailable) {
      this.registerForm.get('username')?.setErrors({ usernameExists: true });
      throw new Error('El nombre de usuario no está disponible');
    }
    
    if (!emailAvailable) {
      this.registerForm.get('email')?.setErrors({ emailExists: true });
      throw new Error('El correo electrónico ya está registrado');
    }
    } catch (error: any) {
      console.error('Error en el registro:', error);
      this.formError = true;
      
      if (error.status === 409) {
        this.formErrorText = 'El nombre de usuario o correo electrónico ya está en uso.';
      } else if (error.status === 400 && error.error?.message) {
        this.formErrorText = error.error.message;
      } else if (error.message) {
        this.formErrorText = error.message;
      } else {
        this.formErrorText = 'Error de red o del servidor. Intente nuevamente más tarde.';
      }
    } finally {
      this.isLoading = false;
    }
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}