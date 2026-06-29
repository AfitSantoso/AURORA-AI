import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';

  constructor(private router: Router) {
    // Check if already logged in
    if (localStorage.getItem('aurora_auth') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username dan Password wajib diisi';
      return;
    }

    // Accept admin / admin or any dummy login for prototype ease
    if (this.username.toLowerCase() === 'admin' && this.password === 'admin') {
      localStorage.setItem('aurora_auth', 'true');
      localStorage.setItem('aurora_user', JSON.stringify({
        username: 'admin',
        role: 'Deputy Director',
        name: 'BM Jakarta Selatan'
      }));
      this.router.navigate(['/dashboard']);
    } else if (this.username.toLowerCase() === 'rm' && this.password === 'rm') {
      localStorage.setItem('aurora_auth', 'true');
      localStorage.setItem('aurora_user', JSON.stringify({
        username: 'rm',
        role: 'Regional Manager',
        name: 'RM Jakarta Selatan'
      }));
      this.router.navigate(['/dashboard']);
    } else {
      // Allow any combination for demo, but show message if incorrect just to show capability
      // Let's actually accept any login for prototype convenience, but pre-populate the placeholder
      localStorage.setItem('aurora_auth', 'true');
      localStorage.setItem('aurora_user', JSON.stringify({
        username: this.username,
        role: 'Regional Manager',
        name: this.username.charAt(0).toUpperCase() + this.username.slice(1)
      }));
      this.router.navigate(['/dashboard']);
    }
  }
}
