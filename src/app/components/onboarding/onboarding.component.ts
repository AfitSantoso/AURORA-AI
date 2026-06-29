import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit, OnDestroy {
  activeTab: 'penny' | 'vision' = 'penny';

  // Option 1: Penny Drop States
  pennyStep = 1; // 1: Form, 2: Inquiry Loader, 3: Bank Result, 4: AI Matching
  pennyForm = {
    ownerName: 'ANDI SETIAWAN',
    dealerName: 'Dealer ABC',
    bank: 'Mandiri',
    accountNumber: '1234 5678 9010',
    email: 'andi.setiawan@dealerabc.com',
    agree: true
  };
  pennyProgress = 0;
  pennyInterval: any;
  inquiryTime = '';

  // Option 2: Vision AI States
  visionStep = 1; // 1: Upload, 2: Scanning, 3: Result
  selectedFile: { name: string; size: string } | null = null;
  visionProgress = 0;
  visionInterval: any;
  visionChecklist = {
    detectLogo: false,
    readText: false,
    extractInfo: false,
    verifyDoc: false
  };

  // Mock extracted data from file
  extractedData = {
    ownerName: 'ANDI SETIAWAN',
    bank: 'Mandiri',
    accountNumber: '1234 5678 9010',
    accountType: 'Tabungan',
    branch: 'KCP Jakarta Selatan',
    docDate: '24/05/2025'
  };

  // Verification List (for bottom history log display)
  accountsHistory: any[] = [];

  constructor(private repoService: RepositoryService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('aurora_auth') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadHistory();
  }

  ngOnDestroy() {
    this.clearPennyTimer();
    this.clearVisionTimer();
  }

  loadHistory() {
    this.repoService.getAccounts().subscribe(data => {
      // Pre-fill history list with the current accounts list
      this.accountsHistory = data;
    });
  }

  switchTab(tab: 'penny' | 'vision') {
    this.activeTab = tab;
  }

  // --- PENNY DROP FLOW ---
  startPennyDrop() {
    if (!this.pennyForm.ownerName || !this.pennyForm.accountNumber) {
      alert('Nama Pemilik Rekening dan Nomor Rekening harus diisi.');
      return;
    }

    this.pennyStep = 2;
    this.pennyProgress = 0;

    this.pennyInterval = setInterval(() => {
      this.pennyProgress += 20;
      if (this.pennyProgress >= 100) {
        this.clearPennyTimer();
        this.inquiryTime = new Date().toLocaleString('id-ID', { hour12: false });
        this.pennyStep = 3;
      }
    }, 400);
  }

  clearPennyTimer() {
    if (this.pennyInterval) {
      clearInterval(this.pennyInterval);
    }
  }

  proceedToPennyAi() {
    this.pennyStep = 4;
  }

  savePennyToRepository() {
    const now = new Date().toLocaleString('id-ID', { hour12: false });
    this.repoService.addAccount({
      ownerName: this.pennyForm.ownerName.toUpperCase(),
      dealerName: this.pennyForm.dealerName,
      bank: this.pennyForm.bank,
      accountNumber: this.pennyForm.accountNumber,
      email: this.pennyForm.email,
      onboardingDate: now,
      status: 'Terverifikasi',
      similarityScore: 98,
      source: 'Penny Drop'
    });

    // Reset Form & Step
    alert('Rekening berhasil diverifikasi dan disimpan ke Trusted Repository!');
    this.pennyStep = 1;
    this.pennyForm = {
      ownerName: '',
      dealerName: 'Dealer ABC',
      bank: 'Mandiri',
      accountNumber: '',
      email: '',
      agree: true
    };
    this.loadHistory();
  }

  // --- VISION AI FLOW ---
  onFileSelect(event: any) {
    // Simulate selecting file
    this.selectedFile = {
      name: 'buku_tabungan_mandiri.jpg',
      size: '1.2 MB'
    };
  }

  triggerUploadClick() {
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  processDocument() {
    if (!this.selectedFile) {
      alert('Mohon unggah dokumen rekening terlebih dahulu.');
      return;
    }

    this.visionStep = 2;
    this.visionProgress = 0;
    this.visionChecklist = {
      detectLogo: false,
      readText: false,
      extractInfo: false,
      verifyDoc: false
    };

    this.visionInterval = setInterval(() => {
      this.visionProgress += 10;
      
      if (this.visionProgress >= 20) this.visionChecklist.detectLogo = true;
      if (this.visionProgress >= 50) this.visionChecklist.readText = true;
      if (this.visionProgress >= 75) this.visionChecklist.extractInfo = true;
      
      if (this.visionProgress >= 100) {
        this.visionChecklist.verifyDoc = true;
        this.clearVisionTimer();
        setTimeout(() => {
          this.visionStep = 3;
        }, 300);
      }
    }, 300);
  }

  clearVisionTimer() {
    if (this.visionInterval) {
      clearInterval(this.visionInterval);
    }
  }

  saveVisionToRepository() {
    const now = new Date().toLocaleString('id-ID', { hour12: false });
    this.repoService.addAccount({
      ownerName: this.extractedData.ownerName.toUpperCase(),
      dealerName: 'Dealer ABC', // Defaults for demo
      bank: this.extractedData.bank,
      accountNumber: this.extractedData.accountNumber,
      onboardingDate: now,
      status: 'Terverifikasi',
      similarityScore: 96,
      source: 'Vision AI'
    });

    alert('Rekening berhasil diverifikasi melalui Vision AI dan disimpan ke Trusted Repository!');
    this.visionStep = 1;
    this.selectedFile = null;
    this.loadHistory();
  }
}
