import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RepositoryService, TransactionAlert } from '../../services/repository.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  alerts: TransactionAlert[] = [];
  
  // Dashboard Metrics
  totalAlerts = 1248;
  highRisk = 128;
  mediumRisk = 352;
  lowRisk = 768;

  // Real-time alert counts (from service)
  activeAlertsCount = 0;
  pendingRMCount = 0;
  pendingDDCount = 0;

  currentUser: any = null;

  constructor(private repoService: RepositoryService, private router: Router) {}

  ngOnInit() {
    // Check authentication
    if (localStorage.getItem('aurora_auth') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    const userStr = localStorage.getItem('aurora_user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }

    // Get live data from RepositoryService
    this.repoService.getAlerts().subscribe(data => {
      this.alerts = data;
      
      // Calculate active alerts (New and In Review)
      const active = data.filter(a => a.status !== 'Closed');
      this.activeAlertsCount = active.length;
      
      // Calculate pending RM verifications
      this.pendingRMCount = active.filter(a => !a.rmDecision).length;

      // Calculate pending Deputy Director verifications
      this.pendingDDCount = active.filter(a => a.rmDecision && !a.ddDecision).length;

      // Dynamically override dashboard cards with service values to show interactivity
      // For instance, we show live alerts count alongside historical totals
      this.highRisk = 128 + data.filter(a => a.riskLevel === 'High' && a.status === 'New').length;
      this.mediumRisk = 352 + data.filter(a => a.riskLevel === 'Medium' && a.status === 'New').length;
      this.lowRisk = 768 + data.filter(a => a.riskLevel === 'Low' && a.status === 'New').length;
      this.totalAlerts = this.highRisk + this.mediumRisk + this.lowRisk;
    });
  }

  logout() {
    localStorage.removeItem('aurora_auth');
    localStorage.removeItem('aurora_user');
    this.router.navigate(['/login']);
  }
}
