import { Component } from '@angular/core';
import { UiState } from '../../services/ui-state';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private auth : AuthService, private ui : UiState) {}

  onSearch(event : any) {
    this.ui.setSearch(event.target.value);
  }

  sortProducts(event : any) {
    this.ui.setSort(event.target.value);
  }
}
