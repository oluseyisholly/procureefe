import Link from "next/link";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-emerald-100 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
          P
        </div>
        <div>
          <h2 className="text-sm font-semibold text-emerald-900">Procuree Dashboard</h2>
          <p className="text-xs text-emerald-500">Bulk buying coordination hub</p>
        </div>
      </div>
      <nav className="flex items-center gap-4 text-sm text-emerald-600">
        <Link href="/dashboard" className="hover:text-emerald-800">
          Overview
        </Link>
        <Link href="/dashboard/requests" className="hover:text-emerald-800">
          Requests
        </Link>
        <Link href="/dashboard/groups" className="hover:text-emerald-800">
          Groups
        </Link>
      </nav>
    </header>
  );
}
