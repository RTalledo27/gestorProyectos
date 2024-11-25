import { Component, Input,  } from '@angular/core';
import { AuthentificationService } from '../../../services/auth/authentification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() title: string ='';
  userName: string = '';
  showDropdown = false;


  constructor(private authService: AuthentificationService) { }


  ngOnInit(): void {
    this.getDataPerfil();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }


  getDataPerfil(): void {
    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        this.userName = perfil.nombres;
        console.table(perfil);
      },
      error: (error) => {
        console.error('Error getting user data:', error);
      }
    });
  }



  logout(): void {
    this.authService.logout();
  }

}
