import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepositoryService, TransactionAlert } from '../../services/repository.service';

@Component({
  selector: 'app-dd-verification',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dd-verification.component.html',
  styleUrl: './dd-verification.component.css'
})
export class DdVerificationComponent implements OnInit {
  alertId = '';
  alert?: TransactionAlert;
  
  // DD Inputs
  notes = '';
  decision: 'Setuju & Lanjutkan' | 'Tunda / Freeze' | 'Escalate ke Audit' | 'Tolak' = 'Setuju & Lanjutkan';

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
        this.router.navigate(['/alerts']);
      } else if (this.alert.ddDecision) {
        this.notes = this.alert.ddDecision.notes;
        this.decision = this.alert.ddDecision.decision;
      }
    });
  }

  saveDecision() {
    if (!this.alert) return;

    if (!this.notes) {
      alert('Mohon tulis catatan keputusan terlebih dahulu.');
      return;
    }

    const now = new Date().toLocaleString('id-ID', { hour12: false });
    
    // Save DD decision
    this.alert.ddDecision = {
      notes: this.notes,
      decision: this.decision,
      date: now,
      by: 'Deputy Director'
    };
    
    this.alert.status = 'Closed';
    this.alert.history.push({
      date: now,
      message: `Keputusan akhir diambil oleh Deputy Director: [${this.decision}]. Status ditutup.`
    });

    // If decision is 'Setuju & Lanjutkan' (Approve & Proceed), onboard the bank account to the Trusted Repository!
    if (this.decision === 'Setuju & Lanjutkan') {
      // Split the account info "BCA 0855 6677 1234"
      const parts = this.alert.targetAccount.split(' ');
      const bank = parts[0] || 'BCA';
      const num = parts.slice(1).join(' ') || '0855 6677 1234';

      this.repoService.addAccount({
        ownerName: this.alert.recipientName,
        dealerName: this.alert.dealerName,
        bank: bank,
        accountNumber: num,
        onboardingDate: now,
        status: 'Terverifikasi',
        similarityScore: this.alert.nameSimilarity,
        source: 'Penny Drop' // Or resolved via escalation
      });

      this.alert.history.push({
        date: now,
        message: `Rekening ${this.alert.targetAccount} otomatis ditambahkan ke Trusted Repository.`
      });
    }

    this.repoService.updateAlert(this.alert);
    
    // Redirect to Alerts page to see the closed alert
    this.router.navigate(['/alerts']);
  }
}
