import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PieChart, ScrollText, Eye, BookOpen, Trophy, Settings, Newspaper, GraduationCap } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trade', icon: ArrowRightLeft, label: 'Trade' },
  { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { to: '/history', icon: ScrollText, label: 'History' },
  { to: '/watchlist', icon: Eye, label: 'Watchlist' },
  { to: '/news', icon: Newspaper, label: 'News' },
  { to: '/learn', icon: BookOpen, label: 'Learn' },
  { to: '/guide', icon: GraduationCap, label: 'Guide' },
  { to: '/challenges', icon: Trophy, label: 'Challenges' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-xl border-t border-border-light z-40 flex justify-around py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-all duration-200 ${
              isActive ? 'text-accent glow-accent' : 'text-text-muted'
            }`
          }
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
