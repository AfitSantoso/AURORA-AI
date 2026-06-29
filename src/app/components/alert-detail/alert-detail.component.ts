import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RepositoryService, TransactionAlert } from '../../services/repository.service';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.css'
})
export class AlertDetailComponent implements OnInit {
  alertId = '';
  alert?: TransactionAlert;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('aurora_auth') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.alertId = params.get('id') || '';
      this.alert = this.repoService.getAlertById(this.alertId);
      
      if (!this.alert) {
        // If not found, redirect to alerts page
        this.router.navigate(['/alerts']);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  }

  startVerification() {
    this.router.navigate(['/alerts', this.alertId, 'rm-verification']);
  }
}
