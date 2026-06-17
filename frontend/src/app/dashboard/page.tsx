'use client';

import { useEffect, useState } from 'react';
import { Car, DollarSign, Wrench, CalendarClock, TrendingUp, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatSessionStatus,
  formatKartMaintenanceStatus,
  formatKartMaintenancePriority,
  formatKartType,
} from '@/lib/utils';

interface DashboardStats {
  totalKarts: number;
  availableKarts: number;
  racingKarts: number;
  fleetUtilizationRate: number;
  openKartMaintenance: number;
  urgentKartMaintenance: number;
  pendingTrackMaintenance: number;
  dailyRevenue: number;
  recentSessions: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    helmetRentalRevenue: number;
    sessionAt: string;
    status: string;
    kartFleet?: { name: string; section: string; kartType: string };
  }>;
  recentKartMaintenance: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    kartFleet?: { name: string; section: string };
  }>;
  pitSections: Array<{ section: string; kartCount: number }>;
  monthlyTrend: Array<{ month: string; sessions: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Kart filosu kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Filo Kullanımı"
                value={formatPercent(stats.fleetUtilizationRate)}
                description={`${stats.availableKarts}/${stats.totalKarts} kart müsait`}
                icon={<Car className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.racingKarts} kart pistte`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="Açık Kart Bakımı"
                value={stats.openKartMaintenance}
                description={`${stats.urgentKartMaintenance} acil/yüksek öncelik`}
                icon={<Wrench className="h-4 w-4" />}
              />
              <StatCard
                title="Pist Bakım Planı"
                value={stats.pendingTrackMaintenance}
                description="7 gün içinde planlanan"
                icon={<CalendarClock className="h-4 w-4" />}
              />
            </div>

            <Card className="pit-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg normal-case">
                  <DollarSign className="h-4 w-4 text-accent" />
                  Son Yarış Oturumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz oturum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.kartFleet?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.kartFleet?.section} · {formatKartType(session.kartFleet?.kartType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(
                              session.cashAmount + session.cardAmount + session.helmetRentalRevenue,
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="pit-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg normal-case">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık Kart Bakım Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentKartMaintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık bakım kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentKartMaintenance.map((item) => (
                      <div key={item.id} className="bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.kartFleet?.name} · {formatKartMaintenancePriority(item.priority)} ·{' '}
                          {formatKartMaintenanceStatus(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="pit-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg normal-case">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.monthlyTrend.map((row) => (
                    <div key={row.month} className="flex justify-between text-sm">
                      <span>{formatTrendMonth(row.month)}</span>
                      <span className="font-mono font-semibold">{formatCurrency(row.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="pit-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg normal-case">
                    <Car className="h-4 w-4 text-accent" />
                    Pit Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.pitSections.map((z) => (
                    <div key={z.section} className="flex justify-between text-sm">
                      <span>{z.section}</span>
                      <Badge variant="secondary">{z.kartCount} kart</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
