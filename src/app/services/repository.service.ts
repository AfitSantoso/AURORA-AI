import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TrustedAccount {
  id: string;
  ownerName: string;
  dealerName: string;
  bank: string;
  accountNumber: string;
  email?: string;
  onboardingDate: string;
  status: 'Terverifikasi' | 'Ditolak';
  similarityScore: number;
  source: 'Penny Drop' | 'Vision AI';
}

export interface TransactionAlert {
  id: string;
  date: string;
  alertType: string;
  recipientName: string;
  targetAccount: string;
  dealerName: string;
  branch: string;
  amount: number;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  status: 'New' | 'In Review' | 'Closed';
  aiMatchScore: number;
  nameSimilarity: number;
  internalRelationScore: string;
  aiReasons: string[];
  rmDecision?: {
    notes: string;
    decision: 'Approve' | 'Request Evidence' | 'Investigasi' | 'Freeze Refund';
    date: string;
    by: string;
  };
  ddDecision?: {
    notes: string;
    decision: 'Setuju & Lanjutkan' | 'Tunda / Freeze' | 'Escalate ke Audit' | 'Tolak';
    date: string;
    by: string;
  };
  history: { date: string; message: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private accountsKey = 'aurora_trusted_accounts';
  private alertsKey = 'aurora_transaction_alerts';

  private accounts$ = new BehaviorSubject<TrustedAccount[]>([]);
  private alerts$ = new BehaviorSubject<TransactionAlert[]>([]);

  constructor() {
    this.initData();
  }

  private initData() {
    // 1. Initial Mock Accounts (Riwayat Validasi Rekening)
    const storedAccounts = localStorage.getItem(this.accountsKey);
    if (storedAccounts) {
      this.accounts$.next(JSON.parse(storedAccounts));
    } else {
      const mockAccounts: TrustedAccount[] = [
        {
          id: 'ACC-001',
          ownerName: 'ANDI SETIAWAN',
          dealerName: 'Dealer ABC',
          bank: 'Mandiri',
          accountNumber: '1234 5678 9010',
          email: 'andi.setiawan@dealerabc.com',
          onboardingDate: '24/05/2025 10:45',
          status: 'Terverifikasi',
          similarityScore: 98,
          source: 'Penny Drop'
        },
        {
          id: 'ACC-002',
          ownerName: 'PT MAJU MOTOR',
          dealerName: 'Maju Motor',
          bank: 'BNI',
          accountNumber: '9876 5432 1098',
          onboardingDate: '22/05/2025 14:20',
          status: 'Terverifikasi',
          similarityScore: 95,
          source: 'Penny Drop'
        },
        {
          id: 'ACC-003',
          ownerName: 'CV BERKAT JAYA',
          dealerName: 'Berkat Jaya',
          bank: 'BRI',
          accountNumber: '1122 3344 5566',
          onboardingDate: '21/05/2025 09:15',
          status: 'Terverifikasi',
          similarityScore: 97,
          source: 'Penny Drop'
        },
        {
          id: 'ACC-004',
          ownerName: 'RINA WULANDARI',
          dealerName: 'XYZ Motor',
          bank: 'BCA',
          accountNumber: '0011 2233 4455',
          onboardingDate: '20/05/2025 16:33',
          status: 'Terverifikasi',
          similarityScore: 100,
          source: 'Penny Drop'
        },
        {
          id: 'ACC-005',
          ownerName: 'JOKO PRASETYO',
          dealerName: 'Dealer Maju',
          bank: 'Mandiri',
          accountNumber: '7788 9900 1122',
          onboardingDate: '19/05/2025 11:05',
          status: 'Ditolak',
          similarityScore: 48,
          source: 'Penny Drop'
        }
      ];
      this.saveAccounts(mockAccounts);
    }

    // 2. Initial Mock Alerts
    const storedAlerts = localStorage.getItem(this.alertsKey);
    if (storedAlerts) {
      this.alerts$.next(JSON.parse(storedAlerts));
    } else {
      const mockAlerts: TransactionAlert[] = [
        {
          id: 'AL-2505-00124',
          date: '24/05/2025 10:45',
          alertType: 'Pembayaran Angsuran Non Debitur',
          recipientName: 'ANDI SETIAWAN',
          targetAccount: 'BCA 0855 6677 1234',
          dealerName: 'Dealer ABC',
          branch: 'Jakarta Selatan',
          amount: 15000000,
          riskScore: 92,
          riskLevel: 'High',
          status: 'New',
          aiMatchScore: 35,
          nameSimilarity: 93,
          internalRelationScore: 'Rendah',
          aiReasons: [
            'Nama penerima 93% mirip dengan Sales Dealer X (90% dengan Sales Dealer Y)',
            'Rekening tidak ditemukan di database internal',
            'Tidak ditemukan relasi kuat dengan Dealer ABC',
            'Pola pembayaran dilakukan oleh rekening yang menerima refund',
            'Rekening baru dibuat 1 hari sebelum transaksi'
          ],
          history: [
            { date: '24/05/2025 10:45', message: 'Alert dibuat oleh AI' }
          ]
        },
        {
          id: 'AL-2505-00123',
          date: '24/05/2025 10:25',
          alertType: 'Refund Dealer',
          recipientName: 'PT. MAJU MOTOR',
          targetAccount: 'BCA 1122 3344 5566',
          dealerName: 'Maju Motor',
          branch: 'Surabaya Barat',
          amount: 45000000,
          riskScore: 78,
          riskLevel: 'High',
          status: 'In Review',
          aiMatchScore: 42,
          nameSimilarity: 95,
          internalRelationScore: 'Rendah',
          aiReasons: [
            'Rekening tidak terdaftar di repository tepercaya',
            'Pola transaksi tidak biasa dibanding histori refund bulanan'
          ],
          history: [
            { date: '24/05/2025 10:25', message: 'Alert dibuat oleh AI' },
            { date: '24/05/2025 11:02', message: 'Alert ditinjau oleh Branch Manager' }
          ]
        },
        {
          id: 'AL-2505-00122',
          date: '23/05/2025 09:15',
          alertType: 'Rekening Mismatch',
          recipientName: 'RINA WULANDARI',
          targetAccount: 'MANDIRI 9888 7777 5566',
          dealerName: 'XYZ Motor',
          branch: 'Medan',
          amount: 22500000,
          riskScore: 65,
          riskLevel: 'Medium',
          status: 'New',
          aiMatchScore: 68,
          nameSimilarity: 85,
          internalRelationScore: 'Sedang',
          aiReasons: [
            'Nama pemilik di dokumen berbeda tipis dengan database bank',
            'Relasi kepemilikan rekening dealer belum diverifikasi penuh'
          ],
          history: [
            { date: '23/05/2025 09:15', message: 'Alert dibuat oleh AI' }
          ]
        },
        {
          id: 'AL-2505-00121',
          date: '23/05/2025 08:30',
          alertType: 'Refund Dealer',
          recipientName: 'CV BERKAT JAYA',
          targetAccount: 'BNI 1234 5678 0012',
          dealerName: 'Berkat Jaya',
          branch: 'Bandung',
          amount: 30000000,
          riskScore: 60,
          riskLevel: 'Medium',
          status: 'New',
          aiMatchScore: 71,
          nameSimilarity: 90,
          internalRelationScore: 'Sedang',
          aiReasons: [
            'Perubahan data rekening bank yang dilaporkan kurang dari 48 jam sebelum proses bayar',
            'Volume transaksi tinggi dari cabang Bandung'
          ],
          history: [
            { date: '23/05/2025 08:30', message: 'Alert dibuat oleh AI' }
          ]
        },
        {
          id: 'AL-2505-00120',
          date: '24/05/2025 08:00',
          alertType: 'Pembayaran Angsuran Non Debitur',
          recipientName: 'BUDI HARTONO',
          targetAccount: 'BCA 8877 6699 0011',
          dealerName: 'Dealer Maju',
          branch: 'Makassar',
          amount: 18000000,
          riskScore: 43,
          riskLevel: 'Low',
          status: 'Closed',
          aiMatchScore: 92,
          nameSimilarity: 98,
          internalRelationScore: 'Tinggi',
          aiReasons: [
            'Rekening lolos verifikasi internal',
            'Profil risiko dealer dikategorikan rendah'
          ],
          history: [
            { date: '24/05/2025 08:00', message: 'Alert dibuat oleh AI' },
            { date: '24/05/2025 09:00', message: 'Disetujui otomatis oleh sistem' }
          ]
        }
      ];
      this.saveAlerts(mockAlerts);
    }
  }

  getAccounts(): Observable<TrustedAccount[]> {
    return this.accounts$.asObservable();
  }

  getAlerts(): Observable<TransactionAlert[]> {
    return this.alerts$.asObservable();
  }

  getAlertById(id: string): TransactionAlert | undefined {
    return this.alerts$.value.find(a => a.id === id);
  }

  addAccount(account: Omit<TrustedAccount, 'id'>): TrustedAccount {
    const current = this.accounts$.value;
    const newAccount: TrustedAccount = {
      ...account,
      id: `ACC-00${current.length + 1}`
    };
    const updated = [newAccount, ...current];
    this.saveAccounts(updated);
    return newAccount;
  }

  updateAlert(alert: TransactionAlert) {
    const current = this.alerts$.value;
    const updated = current.map(a => (a.id === alert.id ? alert : a));
    this.saveAlerts(updated);
  }

  private saveAccounts(accounts: TrustedAccount[]) {
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
    this.accounts$.next(accounts);
  }

  private saveAlerts(alerts: TransactionAlert[]) {
    localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    this.alerts$.next(alerts);
  }

  resetAllData() {
    localStorage.removeItem(this.accountsKey);
    localStorage.removeItem(this.alertsKey);
    this.initData();
  }
}
