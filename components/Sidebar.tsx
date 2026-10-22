"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Search, Users, Columns3, MessageSquareText, Send, MapPin, CalendarClock, Settings, LogOut, Menu, X,
} from "lucide-react";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buscas", label: "Buscas", icon: Search },
  { href: "/leads", label: "Leads", icon: Users, badge: "12 novos" },
  { href: "/funil", label: "Funil", icon: Columns3 },
  { href: "/mensagens", label: "Mensagens", icon: MessageSquareText },
  { href: "/envios", label: "Envios", icon: Send },
  { href: "/cidades", label: "Cidades", icon: MapPin },
  { href: "/agendamentos", label: "Agendamentos", icon: CalendarClock },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      {BRAND.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={BRAND.logo} alt={BRAND.nome} className="h-8 w-auto" />
      ) : (
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand text-[15px] font-bold text-on-brand">
          {BRAND.nome.slice(0, 1)}+
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[16px] font-bold tracking-tight text-white">{BRAND.nome}</span>
        <span className="text-[12px] text-side-muted">{BRAND.produto}</span>
      </span>
    </div>
  );
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, badge }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
              active ? "bg-side-item text-white" : "text-side-ink hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
            {badge && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[12px] text-[#e6e9ee]">{badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function Status() {
  return (
    <div className="flex flex-col gap-1.5 rounded-[10px] bg-white/5 p-3.5">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
        <span className="size-2 rounded-full bg-[#34d399]" />Motor de coleta online
      </div>
      <div className="font-mono text-[12px] text-side-muted">scraper:8080</div>
      <div className="flex items-center gap-2 text-[12px] text-side-muted">
        <span className="size-2 rounded-full bg-[#f87171]" />WhatsApp desconectado
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-7 overflow-y-auto bg-side px-4 py-6 lg:flex">
        <Logo />
        <Nav />
        <div className="mt-auto flex flex-col gap-3">
          <Status />
          <Link href="/login" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-side-ink hover:bg-white/5 hover:text-white">
            <LogOut size={18} aria-hidden="true" />Sair
          </Link>
        </div>
      </aside>

      {/* Mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-side px-4 py-3 lg:hidden">
        <Logo />
        <button type="button" aria-label="Abrir menu" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center rounded-lg text-white hover:bg-white/10">
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col gap-6 overflow-y-auto bg-side px-4 py-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="flex size-11 items-center justify-center rounded-lg text-white hover:bg-white/10">
                <X size={22} />
              </button>
            </div>
            <Nav onNavigate={() => setOpen(false)} />
            <div className="mt-auto"><Status /></div>
          </aside>
        </div>
      )}
    </>
  );
}
