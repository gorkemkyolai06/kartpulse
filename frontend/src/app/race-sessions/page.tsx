'use client';

import { useEffect, useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatSessionStatus,
  formatKartType,
} from '@/lib/utils';

interface KartOption {
  id: string;
  name: string;
  section: string;
}

interface RaceSession {
  id: string;
  cashAmount: number;
  cardAmount: number;
  helmetRentalRevenue: number;
  racers: number;
  sessionAt: string;
  status: string;
  kartFleet?: { id: string; name: string; section: string; kartType: string };
}

interface ListResponse {
  data: RaceSession[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];

const emptyForm = {
  kartFleetId: '',
  cashAmount: '0',
  cardAmount: '0',
  helmetRentalRevenue: '0',
  racers: '0',
  sessionAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function RaceSessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<RaceSession[]>([]);
  const [karts, setKarts] = useState<KartOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.raceSessions.list(token), api.kartFleet.list(token)])
      .then(([sessionsRes, kartsRes]) => {
        setSessions((sessionsRes as ListResponse).data);
        setKarts(
          ((kartsRes as { data: KartOption[] }).data || []).map((k) => ({
            id: k.id,
            name: k.name,
            section: k.section,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.raceSessions.create(token, {
        kartFleetId: form.kartFleetId,
        cashAmount: parseFloat(form.cashAmount),
        cardAmount: parseFloat(form.cardAmount),
        helmetRentalRevenue: parseFloat(form.helmetRentalRevenue),
        racers: parseInt(form.racers, 10),
        sessionAt: form.sessionAt,
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Yarış Oturumları</h1>
            <p className="text-muted-foreground">Günlük yarış geliri ve oturum kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="pit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="pit-card">
            <CardHeader>
              <CardTitle className="font-display normal-case">Oturum Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="kartFleetId">Kart</Label>
                  <select
                    id="kartFleetId"
                    value={form.kartFleetId}
                    onChange={(e) => update('kartFleetId', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Kart seçin</option>
                    {karts.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name} — {k.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashAmount">Nakit ($)</Label>
                  <Input id="cashAmount" type="number" min={0} step="0.01" value={form.cashAmount} onChange={(e) => update('cashAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardAmount">Kart ($)</Label>
                  <Input id="cardAmount" type="number" min={0} step="0.01" value={form.cardAmount} onChange={(e) => update('cardAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="helmetRentalRevenue">Kask Kiralama ($)</Label>
                  <Input id="helmetRentalRevenue" type="number" min={0} step="0.01" value={form.helmetRentalRevenue} onChange={(e) => update('helmetRentalRevenue', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="racers">Yarışçı Sayısı</Label>
                  <Input id="racers" type="number" min={0} value={form.racers} onChange={(e) => update('racers', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionAt">Oturum Tarihi</Label>
                  <Input id="sessionAt" type="datetime-local" value={form.sessionAt} onChange={(e) => update('sessionAt', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatSessionStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="pit-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && sessions.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState title="Oturum bulunamadı" description="Henüz yarış oturumu eklenmemiş." />
        )}
        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="pit-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{session.kartFleet?.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.kartFleet?.section} · {formatKartType(session.kartFleet?.kartType || '')} · {session.racers} yarışçı
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">
                      {formatCurrency(session.cashAmount + session.cardAmount + session.helmetRentalRevenue)}
                    </span>
                    <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
