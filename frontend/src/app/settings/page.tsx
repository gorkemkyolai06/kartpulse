'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface KartTrackProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalKarts: number;
  timezone: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [track, setTrack] = useState<KartTrackProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.kartTrack
      .get(token)
      .then((data) => setTrack(data as KartTrackProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !track) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.kartTrack.update(token, track as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Tesis Ayarları</h1>
          <p className="text-muted-foreground">Go-kart pisti profil bilgileri</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && !track && <ErrorState onRetry={load} />}
        {track && !loading && (
          <Card className="pit-card">
            <CardHeader>
              <CardTitle className="font-display normal-case">Pist Profili</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border border-success bg-success/10 p-3 text-sm text-success" role="status">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Pist Adı</Label>
                  <Input
                    id="name"
                    value={track.name}
                    onChange={(e) => setTrack({ ...track, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={track.phone || ''}
                    onChange={(e) => setTrack({ ...track, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={track.address || ''}
                    onChange={(e) => setTrack({ ...track, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      value={track.city || ''}
                      onChange={(e) => setTrack({ ...track, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">İl</Label>
                    <Input
                      id="state"
                      value={track.state || ''}
                      onChange={(e) => setTrack({ ...track, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Posta Kodu</Label>
                    <Input
                      id="zipCode"
                      value={track.zipCode || ''}
                      onChange={(e) => setTrack({ ...track, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalKarts">Toplam Kart Sayısı</Label>
                  <Input
                    id="totalKarts"
                    type="number"
                    value={track.totalKarts}
                    onChange={(e) =>
                      setTrack({ ...track, totalKarts: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <Button type="submit" disabled={saving} className="pit-btn">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
