import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap, catchError, BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user-model';
import { Roles } from '../authorities-constans';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'role';
  private readonly apiUrl = 'http://localhost:5004/api';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());

  public isLoggedIn$: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body: IUser = { username, password };

    return this.http
      .post<{ token: string }>(`${this.apiUrl}/Auth/login`, body, { headers })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isLoggedInSubject.next(true);

          this.profile().subscribe((response) => {
            localStorage.setItem(this.ROLE_KEY, response.role!);
            this.isAdminSubject.next(response.role == 'admin' ? true : false);
          });
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  profile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/Users/profile`).pipe(
      tap((response) => {
        this.isAdminSubject.next(response.role == 'admin' ? true : false);
      })
    );
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.ROLE_KEY) === Roles.ADMIN;
  }

  showSuccessRegister() {
    this.toastr.success('Cuenta creada con exito');
  }

  showUsernameTakenError() {
    this.toastr.error(
      'El nombre de usuario ya está en uso. Por favor, elige otro.'
    );
  }

  showGenericError() {
    this.toastr.error(
      'Ocurrió un error al intentar crear la cuenta. Intenta nuevamente.'
    );
  }

  register(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http
      .post<{ token: string }>(`${this.apiUrl}/Users`, body, { headers })
      .pipe(
        tap((response) => {
          console.log('respuesta del register', response);
          this.router.navigate(['/login']);
          this.showSuccessRegister();
        }),
        map(() => true),
        catchError((error) => {
          console.log('Error recibido:', error);
          if (
            error?.error?.message ===
            'El nombre de usuario ya está en uso. Por favor, elige otro.'
          ) {
            this.showUsernameTakenError();
          } else {
            this.showGenericError();
          }
          return of(false);
        })
      );
  }
}
