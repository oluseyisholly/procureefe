import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/patrons", label: "Patrons" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function AppSidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-emerald-100 bg-white/80 p-6 backdrop-blur lg:flex">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
          Navigation
        </p>
        <p className="text-sm text-emerald-500">
          Manage your procurement operations effortlessly.
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800",
              activePath === item.href && "bg-emerald-600 text-white hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-emerald-50 p-4 text-xs text-emerald-700">
        Tip: Keep your group profile updated so patrons know exactly what you offer.
      </div>
    </aside>
  );
}
