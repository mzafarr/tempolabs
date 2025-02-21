import { Home, Search, Heart, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const links = [
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="z-50 fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-sm border-t border-gray-200/60 md:hidden">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary">
              TechMatch
            </Link>
            <div className="flex items-center gap-6">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2 ${
                      isActive ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacers for fixed navigation */}
      <div className="h-16 md:block hidden" /> {/* Top spacer */}
      <div className="h-16 md:hidden block" /> {/* Bottom spacer */}
    </>
  );
}
