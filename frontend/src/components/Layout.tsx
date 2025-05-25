import { useEffect, useState } from "preact/hooks";
import { Menu, Play, X } from "lucide-preact";

type NavItem = {
  label: string;
  path?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {label: "Playground", path: "/Playground"},
  {
    label: "Server",
    children: [
      {
        label: "Requests",
        path: "/requests",
        children: [{
          path: "/requests/bodies",
          label: "Bodies"
        }]
      },
      {
        label: "Socket Handler",
        path: "/socket",
      },
      {
        label: "Middlewares",
        path: "/middlewares",
      },
    ],
  },
  {
    label: "Auth",
    children: [
      { label: "Users", path: "/users" },
      {
        label: "Roles",
        children: [
          { label: "Admins", path: "/users/roles/admins" },
          { label: "Permissions", path: "/users/roles/permissions" },
        ],
      },
    ],
  },
  {
    label: "Settings",
    path: "/settings",
  },
];
export function useCurrentPath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    window.addEventListener("pushstate", update); // for custom push
    window.addEventListener("replacestate", update); // optional

    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("pushstate", update);
      window.removeEventListener("replacestate", update);
    };
  }, []);

  return path;
}
function SidebarItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useCurrentPath();
  return (
    <>
      <a
        href={item.path || "#"}
        class={`block text-sm hover:text-white hover:bg-gray-700 transition rounded px-3 py-2 flex items-center ${
          location == item.path ? "text-white font-bold" : "text-gray-400"
        }`}
        style={{ paddingLeft: `${depth * 1.25 + 1}rem` }}
      >
        {depth > 0 && <span class="mr-2 text-gray-500">∟</span>}
        <span>{item.label}</span>
      </a>
      {item.children?.map((child) => (
        <SidebarItem key={child.label} item={child} depth={depth + 1} />
      ))}
    </>
  );
}

function Sidebar({ items }: { items: NavItem[] }) {
  return (
    <div class="p-2 text-sm text-gray-300 font-medium">
      {items.map((item) => (
        <SidebarItem key={item.label} item={item} />
      ))}
    </div>
  );
}
import { ErrorBoundary, lazy, LocationProvider, Route, Router, useLocation } from "preact-iso";


const Home = lazy(() => import("../pages/Home.tsx"));
const NotFound = lazy(() => import("../pages/404.tsx"));
const Settings = lazy(() => import("../pages/Settings.tsx"));
const Bodies = lazy(() => import("../pages/Bodies.tsx"));
const Playground = lazy(() => import("../pages/Playground.tsx"));


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div class="h-screen flex text-white relative overflow-hidden">
      <div
        class={`fixed top-0 left-0 h-full bg-gray-950 z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 shadow-lg`}
      >
        <div class="p-4 flex flex-col h-full">
          <button
            class="self-start p-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <Sidebar items={navItems} />
        </div>
      </div>

      <div
        class={`flex-1 bg-[#1f1f24] min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {!sidebarOpen && (
          <button
            class="fixed top-4 left-4 p-2 z-4 rounded-full bg-gray-800 hover:bg-gray-700 transition z-10"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <div class={"h-screen flex flex-col max-w-screen"}>
          <LocationProvider>
            <ErrorBoundary>
              <Router>
                <Route path="/" component={Home} />
                <Route path="/settings" component={Settings} />
                <Route path="/requests/bodies" component={Bodies} />
                <Route path="/playground" component={Playground} />
                <Route default component={NotFound} />
                {/* Alternative dedicated route component for better TS support */}
                {/* `default` prop indicates a fallback route. Useful for 404 pages */}
                <NotFound />
              </Router>
            </ErrorBoundary>
          </LocationProvider>
        </div>
      </div>
    </div>
  );
}
