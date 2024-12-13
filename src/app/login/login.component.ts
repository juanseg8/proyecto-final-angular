import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  showSuccess() {
    this.toastr.success('Sesion iniciada con exito');
  }

  showError() {
    this.toastr.error('Error en sus credenciales, vuelva a intentarlo');
  }

  onLogin(): void {
    this.authService
      .login(this.username, this.password)
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['/products']);
          this.showSuccess();
        } else {
          this.loginFailed = true;
          this.showError();
        }
      });
  }
}
