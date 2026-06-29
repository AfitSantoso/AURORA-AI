import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepositoryService, TransactionAlert } from '../../services/repository.service';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.css'
})
export class AlertListComponent implements OnInit {
  alerts: TransactionAlert[] = [];
  filteredAlerts: TransactionAlert[] = [];

  // Filter States
  selectedStatus = '';
  selectedRisk = '';
  selectedType = '';
  searchQuery = '';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  displayedAlerts: TransactionAlert[] = [];
  protected readonly Math = Math;

  constructor(private repoService: RepositoryService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('aurora_auth') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    this.repoService.getAlerts().subscribe(data => {
      this.alerts = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredAlerts = this.alerts.filter(alert => {
      const matchStatus = !this.selectedStatus || alert.status === this.selectedStatus;
      const matchRisk = !this.selectedRisk || alert.riskLevel === this.selectedRisk;
      const matchType = !this.selectedType || alert.alertType === this.selectedType;
      
      const query = this.searchQuery.toLowerCase();
      const matchQuery = !query || 
        alert.id.toLowerCase().includes(query) ||
        alert.recipientName.toLowerCase().includes(query) ||
        alert.targetAccount.toLowerCase().includes(query) ||
        alert.dealerName.toLowerCase().includes(query) ||
        alert.branch.toLowerCase().includes(query);

      return matchStatus && matchRisk && matchType && matchQuery;
    });

    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredAlerts.length / this.pageSize) || 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedAlerts = this.filteredAlerts.slice(startIndex, endIndex);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  viewDetail(alertId: string) {
    this.router.navigate(['/alerts', alertId]);
  }
}
