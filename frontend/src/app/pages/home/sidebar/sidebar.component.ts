import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], 
})
export class SidebarComponent {
  isExpanded: boolean = true;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  isRolesMenuOpen = false;

toggleRolesMenu() {
  this.isRolesMenuOpen = !this.isRolesMenuOpen;
}

}
