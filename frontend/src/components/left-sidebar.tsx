'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  DollarSign,
  Wrench,
  CalendarClock,
  HardHat,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
  Flag,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/kart-fleet', label: 'Kart Filosu', icon: Car },
  { href: '/race-sessions', label: 'Yarış Oturumları', icon: DollarSign },
  { href: '/kart-maintenance', label: 'Kart Bakımı', icon: Wrench },
  { href: '/track-maintenance', label: 'Pist Bakımı', icon: CalendarClock },
  { href: '/helmet-inventory', label: 'Kask Envanteri', icon: HardHat },
  { href: '/rate-tiers', label: 'Fiyatlar', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

interface FleetStatusCounts {
  totalKarts: number;
  availableKarts: number;
  racingKarts: number;
}

export function LeftSidebar() {
  const pathname = usePathname();
  const { kartTrack, user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [fleetCounts, setFleetCounts] = useState<FleetStatusCounts | null>(null);

  useEffect(() => {
    if (!token) return;
    api.dashboard
      .stats(token)
      .then((data) => {
        const stats = data as FleetStatusCounts;
        setFleetCounts(stats);
      })
      .catch(() => setFleetCounts(null));
  }, [token, pathname]);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r-4 border-accent bg-card">
      <div className="border-b border-border/60 px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="KartPulse ana sayfa">
          <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground">
            <Flag className="h-5 w-5 text-accent" strokeWidth={2.5} aria-hidden />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wide text-primary">KartPulse</span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Velocity Pit</p>
          </div>
        </Link>
      </div>

      {fleetCounts && (
        <div
          className="border-b border-border/60 bg-muted/30 px-5 py-3 font-mono text-xs text-muted-foreground"
          role="status"
          aria-label="Kart filosu durum özeti"
        >
          <div className="flex justify-between">
            <span>Toplam</span>
            <span className="font-semibold text-foreground">{fleetCounts.totalKarts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-success">Müsait</span>
            <span className="font-semibold text-success">{fleetCounts.availableKarts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent">Pistte</span>
            <span className="font-semibold text-accent">{fleetCounts.racingKarts}</span>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Ana menü">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 border-l-4 px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-transparent text-muted-foreground hover:border-accent/40 hover:bg-muted/50 hover:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border/60 px-4 py-4">
        {kartTrack && (
          <p className="mb-3 truncate text-xs text-muted-foreground">{kartTrack.name}</p>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          {user && (
            <span className="ml-auto bg-secondary px-2 py-1 font-mono text-xs">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
