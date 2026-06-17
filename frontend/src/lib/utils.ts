import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const KART_STATUS: Record<string, string> = {
  available: 'Müsait',
  racing: 'Pistte',
  maintenance: 'Bakımda',
  retired: 'Emekli',
};

export function formatKartStatus(status: string): string {
  return KART_STATUS[status] || status;
}

const KART_TYPE: Record<string, string> = {
  junior: 'Junior',
  standard: 'Standart',
  pro: 'Pro',
  double: 'Çiftli',
};

export function formatKartType(type: string): string {
  return KART_TYPE[type] || type;
}

const SESSION_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatSessionStatus(status: string): string {
  return SESSION_STATUS[status] || status;
}

const KART_MAINTENANCE_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatKartMaintenanceStatus(status: string): string {
  return KART_MAINTENANCE_STATUS[status] || status;
}

const KART_MAINTENANCE_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatKartMaintenancePriority(priority: string): string {
  return KART_MAINTENANCE_PRIORITY[priority] || priority;
}

const TRACK_MAINTENANCE_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatTrackMaintenanceStatus(status: string): string {
  return TRACK_MAINTENANCE_STATUS[status] || status;
}

const TRACK_MAINTENANCE_CATEGORY: Record<string, string> = {
  surface_repair: 'Yüzey Onarımı',
  barrier_check: 'Bariyer Kontrolü',
  timing_system: 'Zamanlama Sistemi',
  drainage: 'Drenaj',
  other: 'Diğer',
};

export function formatTrackMaintenanceCategory(category: string): string {
  return TRACK_MAINTENANCE_CATEGORY[category] || category;
}

const HELMET_TYPE: Record<string, string> = {
  youth: 'Çocuk',
  adult: 'Yetişkin',
  pro: 'Pro',
  balaclava: 'Balaklava',
};

export function formatHelmetType(type: string): string {
  return HELMET_TYPE[type] || type;
}

const HELMET_STATUS: Record<string, string> = {
  available: 'Müsait',
  rented: 'Kirada',
  maintenance: 'Bakımda',
  retired: 'Emekli',
};

export function formatHelmetStatus(status: string): string {
  return HELMET_STATUS[status] || status;
}

const RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatRateStatus(status: string): string {
  return RATE_STATUS[status] || status;
}

const RATE_CATEGORY: Record<string, string> = {
  single_race: 'Tek Yarış',
  heat_package: 'Isı Paketi',
  birthday_party: 'Doğum Günü',
  league_night: 'Lig Gecesi',
  group_event: 'Grup Etkinliği',
  other: 'Diğer',
};

export function formatRateCategory(category: string): string {
  return RATE_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}
