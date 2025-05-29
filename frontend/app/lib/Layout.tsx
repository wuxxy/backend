import { useEffect, useState, type ReactNode } from "react";
import { useAuthRedirect, useAuthStore } from "./auth";
import {
Sheet,
SheetTrigger,
SheetContent,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
Menu,
LogOut,
Save,
Settings,
User,
LayoutDashboard,
PanelLeftOpen,
PanelRightOpen,
SplinePointer,
} from "lucide-react";
import { cn } from "~/lib/utils"; // utility for conditional classes
import { useInstanceStore } from "./playgroundStore";

interface DashboardLayoutProps {
children: ReactNode;
appbarContent?: ReactNode;
}

export default function DashboardLayout({
children,
appbarContent,
}: DashboardLayoutProps) {
  const { logout } = useAuthStore();
  useAuthRedirect(true);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Playground", href: "/playground", icon: SplinePointer },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Account", href: "/account", icon: User },
  ];
  const instance = useInstanceStore((s) => s.instance);
  const [saveAvailable, setSaveAvailable] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");

  // Update save availability and timestamp
  useEffect(() => {
    if (instance.length > 0) {
      setSaveAvailable(true);
      setLastSavedText("Unsaved changes");
    } else {
      setSaveAvailable(false);
      setLastSavedText("");
    }
  }, [instance]);

  const handleSave = () => {
    useInstanceStore.getState().saveInstanceToLocalStorage();
    setLastSavedText("Saved just now");
  };

  return (
    <div className="flex min-h-screen font-sans text-white bg-black">
      {/* 🌙 Mobile Sidebar Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="absolute z-30 top-4 left-4 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 bg-[#0e0e0e] border-r border-white/10"
        >
          <div className="flex items-center h-16 px-6 text-lg font-semibold tracking-wide border-b border-white/10">
            Dashboard
          </div>
          <nav className="flex-1 p-4 space-y-2 text-sm text-white/70">
            {navItems.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 transition hover:text-pink-400"
              >
                <Icon className="w-4 h-4" /> {label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      {/* 🌙 Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-white/10 bg-[#0e0e0e] transition-all duration-300 ease-in-out shadow-[4px_0_20px_rgba(255,0,130,0.05)]",
          collapsed ? "w-16 items-center" : "w-64"
        )}
      >
        <div className="flex items-center justify-between w-full h-16 px-4 border-b border-white/10">
          {!collapsed && (
            <span className="text-lg font-semibold">Dashboard</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-white hover:text-pink-400"
          >
            {collapsed ? (
              <PanelRightOpen className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </Button>
        </div>

        <nav className="flex flex-col flex-1 gap-1 p-2 text-white/70">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-pink-500/10 hover:text-pink-400 transition",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* 🌐 Main Content */}
      <div className="relative flex flex-col flex-1">
        {/* 🧱 Top Appbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between w-full px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4 text-sm font-medium tracking-wide text-white/80">
            {appbarContent ?? (
              <>
                <Button
                  variant="ghost"
                  className="gap-2 text-xs"
                  onClick={handleSave}
                  disabled={!saveAvailable}
                >
                  <Save className="w-4 h-4" /> Save
                </Button>
                {lastSavedText && (
                  <span className="hidden text-xs text-white/40 sm:inline">
                    {lastSavedText}
                  </span>
                )}
              </>
            )}
          </div>
          <Button
            onClick={logout}
            variant="destructive"
            className="text-sm shadow-[0_0_10px_#f43f5e55] gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </header>

        {/* 📦 Page Content */}
        <main className="flex-1 px-6 py-8 bg-gradient-to-br from-[#0e0e0e] to-black overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}