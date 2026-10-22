import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-side px-4">
      <form className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-white/10 bg-[#161a22] p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-on-brand">{BRAND.nome.slice(0, 1)}+</span>
          <div>
            <div className="text-xl font-bold text-white">{BRAND.nome}</div>
            <div className="text-sm text-side-muted">{BRAND.produto}</div>
          </div>
        </div>
        <label className="label text-white">
          E-mail
          <input type="email" className="input !border-white/15 !bg-[#0f1218] !text-white" placeholder="voce@empresa.com.br" autoComplete="email" />
        </label>
        <label className="label text-white">
          Senha
          <input type="password" className="input !border-white/15 !bg-[#0f1218] !text-white" autoComplete="current-password" />
        </label>
        {/* Visual apenas: a autenticação real entra na próxima etapa */}
        <Link href="/" className="flex min-h-11 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-on-brand hover:bg-brand-strong">
          Entrar
        </Link>
      </form>
    </div>
  );
}
