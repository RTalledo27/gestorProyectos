import { Component, NgZone, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../services/auth/authentification.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginIntentos: number = 0;
  bloqueado: boolean = false;
  tiempoBloqueo: number = 0;
  loginError: string | null = null;
  formLogin: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthentificationService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if there's a stored token
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.setToken(token);
      this.router.navigate(['/']);
    }{}
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('ngOnChanges called', changes);
  }

  onSubmit(): void {
    this.loginError = null;

    if (this.formLogin.valid && !this.bloqueado) {
      const { username, password, rememberMe } = this.formLogin.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            if (rememberMe) {
              localStorage.setItem('token', response.token);
            }
            this.authService.setToken(response.token);
            this.router.navigate(['/']);
          } else {
            this.loginError = 'Invalid credentials';
            this.incrementLoginAttempts();
          }
        },
        error: (error) => {
          console.error('Login error', error);
          this.loginError = 'An error occurred during login';
          this.incrementLoginAttempts();
        }
      });
    }
  }

  private incrementLoginAttempts(): void {
    this.loginIntentos++;
    if (this.loginIntentos >= 3) {
      console.log('Intentos de ingreso excedidos, bloqueando cuenta');
      this.restringirIngreso();
    }
  }

  private restringirIngreso(): void {
    this.bloqueado = true;
    this.tiempoBloqueo = 120; // 2 minutos
    const intervalo = setInterval(() => {
      this.ngZone.run(() => {
        this.tiempoBloqueo--;
        //localStorage.setItem('tiempoBloque', this.tiempoBloqueo.toString());
        if (this.tiempoBloqueo <= 0) {
          clearInterval(intervalo);
          this.bloqueado = false;
          this.loginIntentos = 0;

        }
      });
    }, 1000);
  }




  resetPassword(): void {
    const username = this.formLogin.get('username')?.value;
    if (username) {
      console.log('Enviando enlace de restablecimiento de contraseña a:', username);
      // Implement password reset logic here
      // this.authService.resetPassword(username).subscribe(...)
    } else {
      this.loginError = 'Please enter your username to reset password';
    }
  }

  loginWithGoogle(): void {
    console.log('Iniciando sesión con Google');
    // Implement Google OAuth login
    // this.authService.loginWithGoogle().subscribe(...)
  }

  loginWithGithub(): void {
    console.log('Iniciando sesión con GitHub');
    // Implement GitHub OAuth login
    // this.authService.loginWithGithub().subscribe(...)
  }
}
