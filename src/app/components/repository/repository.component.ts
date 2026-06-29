import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RepositoryService, TrustedAccount } from '../../services/repository.service';

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.css'
})
export class RepositoryComponent implements OnInit {
  accounts: TrustedAccount[] = [];
  filteredAccounts: TrustedAccount[] = [];
  
  searchQuery = '';
  filterSource = '';
  
  totalAccounts = 0;
  verifiedCount = 0;
  rejectedCount = 0;

  constructor(private repoService: RepositoryService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('aurora_auth') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    this.repoService.getAccounts().subscribe(data => {
      this.accounts = data;
      this.calculateStats();
      this.applyFilters();
    });
  }

  calculateStats() {
    this.totalAccounts = this.accounts.length;
    this.verifiedCount = this.accounts.filter(a => a.status === 'Terverifikasi').length;
    this.rejectedCount = this.accounts.filter(a => a.status === 'Ditolak').length;
  }

  applyFilters() {
    this.filteredAccounts = this.accounts.filter(acc => {
      const matchSource = !this.filterSource || acc.source === this.filterSource;
      
      const query = this.searchQuery.toLowerCase();
      const matchQuery = !query ||
        acc.ownerName.toLowerCase().includes(query) ||
        acc.dealerName.toLowerCase().includes(query) ||
        acc.accountNumber.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        acc.bank.toLowerCase().includes(query) ||
        acc.id.toLowerCase().includes(query);
        
      return matchSource && matchQuery;
    });
  }

  resetDemoData() {
    if (confirm('Apakah Anda yakin ingin menyetel ulang data simulasi kembali ke setelan default?')) {
      this.repoService.resetAllData();
      alert('Data simulasi berhasil disetel ulang.');
    }
  }
}
