import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  showErrorMinLength() {
    this.toastr.error(
      'El usuario y la contraseña debe ser de minimo 4 caracteres'
    );
  }

  showErrorMismatch() {
    this.toastr.error('Las contraseñas no coinciden');
  }

  passwordMatchValidator(form: FormGroup): null | { mismatch: true } {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    const usernameControl = this.registerForm.get('username');
    const passwordControl = this.registerForm.get('password');

    if (
      usernameControl?.hasError('minlength') ||
      passwordControl?.hasError('minlength')
    ) {
      this.showErrorMinLength();
    } else if (this.registerForm.hasError('mismatch')) {
      this.showErrorMismatch();
    }
    this.authService
      .register(usernameControl?.value, passwordControl?.value)
      .subscribe((response) => {
        console.log('respuesta del auth service register', response);
      });
  }
}
