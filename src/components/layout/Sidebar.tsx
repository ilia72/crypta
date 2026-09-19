import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowRightLeft, PieChart, ScrollText,
  Eye, BookOpen, Trophy, Settings, Menu, X, Newspaper,
  GraduationCap,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice } from '../../utils/formatters';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { to: '/markets', label: 'Markets', icon: ArrowRightLeft, page: 'markets' },
  { to: '/trade', label: 'Trade', icon: ArrowRightLeft, page: 'trade' },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart, page: 'portfolio' },
  { to: '/history', label: 'History', icon: ScrollText, page: 'history' },
  { to: '/watchlist', label: 'Watchlist', icon: Eye, page: 'watchlist' },
  { to: '/news', label: 'News', icon: Newspaper, page: 'news' },
  { to: '/learn', label: 'Learn', icon: BookOpen, page: 'learn' },
  { to: '/guide', label: 'Guide', icon: GraduationCap, page: 'guide' },
  { to: '/challenges', label: 'Challenges', icon: Trophy, page: 'challenges' },
  { to: '/settings', label: 'Settings', icon: Settings, page: 'settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { balance, completedLessonCount, completedChallengeCount } = useStore();
  const location = useLocation();

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-56'} bg-bg-secondary border-r border-border-light flex flex-col transition-all duration-300 hidden md:flex shadow-sidebar`}
    >
      <div className="h-14 flex items-center px-4 border-b border-border-light">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">CRYPTA</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-text-muted hover:text-text-primary transition-colors p-1 rounded hover:bg-bg-hover"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-accent/10 text-accent glow-accent border border-accent/20'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.page === 'learn' && completedLessonCount() > 0 && (
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-semibold">
                      {completedLessonCount()}
                    </span>
                  )}
                  {item.page === 'challenges' && completedChallengeCount() > 0 && (
                    <span className="text-[10px] bg-profit/20 text-profit px-1.5 py-0.5 rounded-full font-semibold">
                      {completedChallengeCount()}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border-light">
        {!collapsed && (
          <div className="text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              Demo Balance
            </div>
            <div className="text-sm font-semibold text-text-primary mt-0.5">{formatPrice(balance)}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
