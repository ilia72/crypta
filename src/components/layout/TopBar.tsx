import { Search, Bell, User, Activity, Globe } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice } from '../../utils/formatters';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

export function TopBar() {
  const { balance, settings, setActivePage } = useStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { language, toggleLanguage } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate('/markets');
    }
  };

  return (
    <header className="h-14 bg-bg-secondary/80 backdrop-blur-xl border-b border-border-light flex items-center px-4 gap-4 sticky top-0 z-30 shadow-topbar">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold gradient-text">CRYPTA</span>
      </div>

      <div className="flex items-center gap-2 text-[10px]">
        <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
        <span className="text-text-muted font-medium">SIMULATION</span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search coins, markets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Activity size={14} className="text-profit" />
          <span className="text-text-muted">Balance:</span>
          <span className="font-semibold text-text-primary">{formatPrice(balance)}</span>
        </div>

        {settings.notifications && (
          <button className="relative p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover transition-all" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </button>
        )}

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2 py-1 bg-bg-hover border border-border-light rounded-lg text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
          title="Switch language"
        >
          <Globe size={14} />
          <span>{language === 'en' ? 'RU' : 'EN'}</span>
        </button>

        <button className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover transition-all" aria-label="Profile">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
