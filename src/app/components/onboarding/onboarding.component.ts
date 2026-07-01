import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
    tipePenerima: 'Individu',
    ownerName: 'ANDI SETIAWAN',
    jabatan: 'Sales/Sales Counter',
    namaPanggilan: 'Andi',
    namaAtasan: 'Budi Santoso',
    kewarganegaraan: 'WNI',
    noKtp: '3171012345678001',
    noSiup: '',
    noNpwp: '01.234.567.8-012.000',
    namaNpwp: 'ANDI SETIAWAN',
    alamatNpwp: 'Jl. Jenderal Sudirman No. 10, Jakarta Pusat',
    tanggalLahir: '1990-05-15',
    tempatLahir: 'Jakarta',
    noTelepon: '021-5551234',
    noHp: '081234567890',
    agama: 'Islam',
    hobi: 'Membaca',
    keterangan: 'Verifikasi rekening komisi dealer',
    
    // Account Info
    accountNumber: '1234 5678 9010',
    atasNamaRekening: 'ANDI SETIAWAN',
    bank: 'Mandiri',
    tipeBank: 'Non BCA',
    kota: 'Jakarta',
    cabang: 'KCP Sudirman',
    tarifPajak: 11,
    
    // Dealer Info
    dealerId: 'DLR-9988',
    dealerName: 'Dealer ABC',
    alamatDealer: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
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

  constructor(
    private repoService: RepositoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
      this.pennyProgress += 10;
      if (this.pennyProgress >= 100) {
        this.clearPennyTimer();
        this.inquiryTime = new Date().toLocaleString('id-ID', { hour12: false });
        this.pennyStep = 3;
      }
      this.cdr.detectChanges();
    }, 300);
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
      source: 'Penny Drop',
      tipePenerima: this.pennyForm.tipePenerima,
      jabatan: this.pennyForm.jabatan,
      noKtp: this.pennyForm.noKtp,
      noNpwp: this.pennyForm.noNpwp,
      noHp: this.pennyForm.noHp,
      atasNamaRekening: this.pennyForm.atasNamaRekening,
      keterangan: this.pennyForm.keterangan,
      dealerId: this.pennyForm.dealerId,
      alamatDealer: this.pennyForm.alamatDealer,
      tipeBank: this.pennyForm.tipeBank,
      kota: this.pennyForm.kota,
      cabang: this.pennyForm.cabang,
      tarifPajak: this.pennyForm.tarifPajak
    });

    // Reset Form & Step
    alert('Rekening berhasil diverifikasi dan disimpan ke Trusted Repository!');
    this.pennyStep = 1;
    this.pennyForm = {
      tipePenerima: 'Individu',
      ownerName: '',
      jabatan: 'Sales/Sales Counter',
      namaPanggilan: '',
      namaAtasan: '',
      kewarganegaraan: 'WNI',
      noKtp: '',
      noSiup: '',
      noNpwp: '',
      namaNpwp: '',
      alamatNpwp: '',
      tanggalLahir: '',
      tempatLahir: '',
      noTelepon: '',
      noHp: '',
      agama: '',
      hobi: '',
      keterangan: '',
      
      // Account Info
      accountNumber: '',
      atasNamaRekening: '',
      bank: 'Mandiri',
      tipeBank: 'Non BCA',
      kota: '',
      cabang: '',
      tarifPajak: 0,
      
      // Dealer Info
      dealerId: '',
      dealerName: 'Dealer ABC',
      alamatDealer: '',
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
          this.cdr.detectChanges();
        }, 300);
      }
      this.cdr.detectChanges();
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
