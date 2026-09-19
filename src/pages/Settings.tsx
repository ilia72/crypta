import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/formatters';
import { RotateCcw, Bell, Moon, DollarSign, Gauge, Monitor } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const { settings, updateSettings, resetAccount, balance, initialBalance } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
          <p className="text-text-secondary text-sm mt-1">Customize your simulator experience.</p>
        </div>
        <SimulatedLabel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Appearance */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Moon size={16} className="text-accent" /> Appearance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Dark Mode</span>
              <button
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-accent' : 'bg-bg-hover'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white mt-1 ml-1 transition-transform ${settings.darkMode ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Trading */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Gauge size={16} className="text-accent" /> Trading
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Currency Display</label>
              <select
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="input-field"
              >
                <option value="USDT">USDT</option>
                <option value="USD">USD</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">Simulation Speed</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={settings.simulationSpeed}
                  onChange={(e) => updateSettings({ simulationSpeed: parseFloat(e.target.value) })}
                  className="flex-1 accent-accent"
                />
                <span className="text-sm text-text-primary w-12">{settings.simulationSpeed}x</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell size={16} className="text-accent" /> Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Enable Notifications</span>
              <button
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-accent' : 'bg-bg-hover'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white mt-1 ml-1 transition-transform ${settings.notifications ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Account */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-accent" /> Account
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Current Balance</span>
              <span className="text-text-primary font-medium">{formatPrice(balance)}</span>
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">Starting Balance (on reset)</label>
              <input
                type="number"
                value={settings.startingBalance}
                onChange={(e) => updateSettings({ startingBalance: parseFloat(e.target.value) || 10000 })}
                className="input-field"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Reset */}
      <Card className="border-loss/30">
        <h3 className="text-sm font-semibold text-loss mb-3 flex items-center gap-2">
          <RotateCcw size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-text-secondary mb-3">
          This will reset your demo account. All trades, positions, and progress will be lost.
        </p>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-loss/10 text-loss rounded-lg text-sm font-semibold hover:bg-loss/20 transition-colors"
          >
            Reset Demo Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs text-text-secondary">Are you sure? This cannot be undone.</p>
            <button
              onClick={() => { resetAccount(); setShowResetConfirm(false); }}
              className="px-4 py-2 bg-loss text-white rounded-lg text-sm font-semibold hover:bg-loss/90 transition-colors"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-bg-hover text-text-secondary rounded-lg text-sm font-semibold hover:bg-border-light transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>

      <Disclaimer />
    </div>
  );
}
