import { Component } from '@angular/core';
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
  username: string = '';
  password: string = '';
  loginError: string | null = null;
  formLogin: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthentificationService,
    private formBuilder:FormBuilder,
  ) {
    this.formLogin = this.formBuilder.group({
      username:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }

  onSubmit() {
    this.loginError = null;

    if(this.formLogin.valid){
      const {username,password}= this.formLogin.value;
      this.authService.login(username,password).subscribe(
        response=>{
          if(response.token){
            this.router.navigate(['/']);
          }else{
            this.loginError = 'Credenciales inválidas';
            console.log(this.loginError)
          }

        },
      )};


    /*if (!this.email || !this.password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión con:', this.email, this.password);
    // Simulación de encriptación de contraseña
    const encryptedPassword = btoa(this.password);
    console.log('Contraseña encriptada:', encryptedPassword);
    // Simulación de generación de token
    const token = Math.random().toString(36).substr(2);
    localStorage.setItem('authToken', token);
    // Redirección al dashboard
    this.router.navigate(['/dashboard']);*/
  }

  resetPassword() {
    console.log('Enviando enlace de restablecimiento de contraseña a:', this.username);
    // Aquí iría la lógica para enviar el correo de restablecimiento
  }

  loginWithGoogle() {
    console.log('Iniciando sesión con Google');
    // Aquí iría la lógica de autenticación con Google
  }

  loginWithGithub() {
    console.log('Iniciando sesión con GitHub');
    // Aquí iría la lógica de autenticación con GitHub
  }
}
