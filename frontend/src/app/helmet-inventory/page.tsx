'use client';

import { useEffect, useState } from 'react';
import { Plus, HardHat } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatHelmetType, formatHelmetStatus, formatCurrency } from '@/lib/utils';

interface HelmetItem {
  id: string;
  name: string;
  helmetType: string;
  size?: string;
  status: string;
  rentalPrice: number;
}

interface ListResponse {
  data: HelmetItem[];
  total: number;
}

const HELMET_TYPES = ['youth', 'adult', 'pro', 'balaclava'];
const STATUSES = ['available', 'rented', 'maintenance', 'retired'];

const emptyForm = {
  name: '',
  helmetType: 'adult',
  size: '',
  status: 'available',
  rentalPrice: '4',
};

export default function HelmetInventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<HelmetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.helmetInventory
      .list(token)
      .then((res) => setItems((res as ListResponse).data))
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
      await api.helmetInventory.create(token, {
        name: form.name,
        helmetType: form.helmetType,
        size: form.size || undefined,
        status: form.status,
        rentalPrice: parseFloat(form.rentalPrice),
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
            <h1 className="font-display text-3xl text-primary">Kask Envanteri</h1>
            <p className="text-muted-foreground">Kask kiralama envanteri ve durum takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="pit-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kask'}
          </Button>
        </div>

        {showForm && (
          <Card className="pit-card">
            <CardHeader>
              <CardTitle className="font-display normal-case">Kask Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Kask Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="helmetType">Tip</Label>
                  <select id="helmetType" value={form.helmetType} onChange={(e) => update('helmetType', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {HELMET_TYPES.map((t) => (
                      <option key={t} value={t}>{formatHelmetType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Beden</Label>
                  <Input id="size" value={form.size} onChange={(e) => update('size', e.target.value)} placeholder="S, M, L, XL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentalPrice">Kiralama Fiyatı ($)</Label>
                  <Input id="rentalPrice" type="number" min={0} step="0.01" value={form.rentalPrice} onChange={(e) => update('rentalPrice', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatHelmetStatus(s)}</option>
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
        {error && !loading && items.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Kask bulunamadı" description="Henüz kask eklenmemiş." />
        )}
        {!loading && items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id} className="pit-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <HardHat className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatHelmetType(item.helmetType)} · {item.size || 'Beden yok'} · {formatCurrency(item.rentalPrice)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatHelmetStatus(item.status)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
