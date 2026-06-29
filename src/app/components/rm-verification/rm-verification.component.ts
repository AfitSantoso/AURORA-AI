import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepositoryService, TransactionAlert } from '../../services/repository.service';

@Component({
  selector: 'app-rm-verification',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './rm-verification.component.html',
  styleUrl: './rm-verification.component.css'
})
export class RmVerificationComponent implements OnInit {
  alertId = '';
  alert?: TransactionAlert;
  
  // RM Inputs
  notes = '';
  decision: 'Approve' | 'Request Evidence' | 'Investigasi' | 'Freeze Refund' = 'Investigasi';
  
  // Mock viewer modal state
  activeDoc: string | null = null;

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
      } else if (this.alert.rmDecision) {
        // Pre-fill notes if already exist
        this.notes = this.alert.rmDecision.notes;
        this.decision = this.alert.rmDecision.decision;
      }
    });
  }

  showDocument(docName: string) {
    this.activeDoc = docName;
  }

  closeDocument() {
    this.activeDoc = null;
  }

  rejectAndReturn() {
    if (!this.alert) return;
    
    const now = new Date().toLocaleString('id-ID', { hour12: false });
    this.alert.status = 'Closed';
    this.alert.history.push({
      date: now,
      message: `Ditolak & dikembalikan oleh Regional Manager. Catatan: ${this.notes || 'Tidak ada catatan.'}`
    });
    
    this.repoService.updateAlert(this.alert);
    this.router.navigate(['/alerts']);
  }

  sendToDeputyDirector() {
    if (!this.alert) return;

    if (!this.notes) {
      alert('Mohon tulis catatan verifikasi terlebih dahulu.');
      return;
    }

    const now = new Date().toLocaleString('id-ID', { hour12: false });
    
    // Save RM decision
    this.alert.rmDecision = {
      notes: this.notes,
      decision: this.decision,
      date: now,
      by: 'Regional Manager'
    };
    
    this.alert.status = 'In Review';
    this.alert.history.push({
      date: now,
      message: `Telah ditinjau oleh RM dengan keputusan: [${this.decision}]. Diteruskan ke Deputy Director.`
    });

    this.repoService.updateAlert(this.alert);
    
    // Navigate to Deputy Director view for high interactive feedback
    this.router.navigate(['/alerts', this.alertId, 'dd-verification']);
  }
}
