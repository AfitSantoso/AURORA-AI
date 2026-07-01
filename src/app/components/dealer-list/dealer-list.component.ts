import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepositoryService, TrustedAccount } from '../../services/repository.service';

@Component({
  selector: 'app-dealer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dealer-list.component.html',
  styleUrl: './dealer-list.component.css'
})
export class DealerListComponent implements OnInit {
  accounts: TrustedAccount[] = [];
  dealers: { id: string; name: string; address: string }[] = [];
  selectedDealerId: string = 'ALL';
  filteredAccounts: TrustedAccount[] = [];

  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    this.repoService.getAccounts().subscribe(data => {
      // If mock data is from the old schema (missing new fields), reset it
      if (data.length > 0 && data.some(a => a.status === 'Terverifikasi' && !a.noKtp)) {
        this.repoService.resetAllData();
        return;
      }
      this.accounts = data.filter(a => a.status === 'Terverifikasi');
      this.extractDealers();
      this.filterAccounts();
    });
  }

  extractDealers() {
    const dealerMap = new Map<string, { id: string; name: string; address: string }>();
    this.accounts.forEach(acc => {
      const dId = acc.dealerId || 'DLR-UNKNOWN';
      const dName = acc.dealerName || 'Unknown Dealer';
      const dAddr = acc.alamatDealer || 'Unknown Address';
      if (!dealerMap.has(dId)) {
        dealerMap.set(dId, { id: dId, name: dName, address: dAddr });
      }
    });
    this.dealers = Array.from(dealerMap.values());
  }

  filterAccounts() {
    if (this.selectedDealerId === 'ALL') {
      this.filteredAccounts = this.accounts;
    } else {
      this.filteredAccounts = this.accounts.filter(a => a.dealerId === this.selectedDealerId);
    }
  }

  onDealerChange() {
    this.filterAccounts();
  }

  getSelectedDealerDetails() {
    if (this.selectedDealerId === 'ALL') {
      return {
        id: 'SEMUA',
        name: 'SEMUA DEALER',
        address: 'Semua Alamat Dealer Terdaftar',
        date: '-'
      };
    }
    const dealerAcc = this.accounts.find(a => a.dealerId === this.selectedDealerId);
    return {
      id: dealerAcc?.dealerId || '-',
      name: dealerAcc?.dealerName || '-',
      address: dealerAcc?.alamatDealer || '-',
      date: dealerAcc?.onboardingDate.split(' ')[0] || '-'
    };
  }

  // MASKING functions for KTP, NPWP, HP
  maskKtp(ktp?: string): string {
    if (!ktp) return '-';
    const clean = ktp.replace(/\s+/g, '');
    if (clean.length < 10) return 'XXX-XXX-XXX';
    return clean.substring(0, 6) + '******' + clean.substring(12);
  }

  maskNpwp(npwp?: string): string {
    if (!npwp) return '-';
    // Format: 01.234.567.8-012.000 -> 01.234.***.*-***.***
    const parts = npwp.split(/[\.-]/);
    if (parts.length >= 4) {
      return `${parts[0]}.${parts[1]}.***.*-***.***`;
    }
    return 'XX.XXX.***.X-***.***';
  }

  maskHp(hp?: string): string {
    if (!hp) return '-';
    const clean = hp.replace(/\s+/g, '');
    if (clean.length < 8) return 'XXXX-XXXX';
    return clean.substring(0, 4) + '****' + clean.substring(clean.length - 4);
  }
}
