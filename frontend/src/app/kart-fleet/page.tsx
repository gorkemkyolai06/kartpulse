'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Car } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatKartStatus, formatKartType } from '@/lib/utils';

interface KartFleetItem {
  id: string;
  name: string;
  section: string;
  kartType: string;
  engineSpec?: string;
  status: string;
}

interface ListResponse {
  data: KartFleetItem[];
  total: number;
}

const KART_TYPES = ['junior', 'standard', 'pro', 'double'];
const STATUSES = ['available', 'racing', 'maintenance', 'retired'];

const emptyForm = {
  name: '',
  section: '',
  kartType: 'standard',
  engineSpec: '',
  status: 'available',
};

export default function KartFleetPage() {
  const { token } = useAuth();
  const [karts, setKarts] = useState<KartFleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.kartFleet
      .list(token)
      .then((res) => setKarts((res as ListResponse).data))
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
      await api.kartFleet.create(token, {
        name: form.name,
        section: form.section,
        kartType: form.kartType,
        engineSpec: form.engineSpec || undefined,
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

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu kartı silmek istediğinize emin misiniz?')) return;
    try {
      await api.kartFleet.delete(token, id);
      load();
    } catch {
      setError(true);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Kart Filosu</h1>
            <p className="text-muted-foreground">Junior, standart, pro ve çiftli kart envanteri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="pit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kart'}
          </Button>
        </div>

        {showForm && (
          <Card className="pit-card">
            <CardHeader>
              <CardTitle className="font-display normal-case">Kart Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Kart Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Pit Bölümü</Label>
                  <Input id="section" value={form.section} onChange={(e) => update('section', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kartType">Kart Tipi</Label>
                  <select
                    id="kartType"
                    value={form.kartType}
                    onChange={(e) => update('kartType', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                  >
                    {KART_TYPES.map((t) => (
                      <option key={t} value={t}>{formatKartType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineSpec">Motor Özelliği</Label>
                  <Input
                    id="engineSpec"
                    value={form.engineSpec}
                    onChange={(e) => update('engineSpec', e.target.value)}
                    placeholder="Örn: 9 HP, 13 HP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatKartStatus(s)}</option>
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
        {error && !loading && karts.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && karts.length === 0 && (
          <EmptyState
            title="Kart bulunamadı"
            description="Henüz kart eklenmemiş."
            action={
              <Button onClick={() => setShowForm(true)} className="pit-btn">
                <Plus className="mr-2 h-4 w-4" />
                Kart Ekle
              </Button>
            }
          />
        )}
        {!loading && karts.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {karts.map((kart) => (
              <Card key={kart.id} className="pit-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-accent/10 text-accent">
                      <Car className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg normal-case">{kart.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {kart.section} · {formatKartType(kart.kartType)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {kart.engineSpec || 'Motor belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formatKartStatus(kart.status)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(kart.id)}
                      className="text-destructive"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
