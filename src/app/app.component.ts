import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  showSidebar = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check path on initial load and route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide sidebar on login page
        this.showSidebar = !event.urlAfterRedirects.includes('/login');
      });

    // Handle initial redirect or state check
    const isLoggedIn = localStorage.getItem('aurora_auth') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
