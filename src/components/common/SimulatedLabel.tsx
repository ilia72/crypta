export function SimulatedLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20 backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      SIMULATED
    </span>
  );
}

export function Disclaimer() {
  return (
    <div className="text-xs text-text-muted bg-bg-tertiary/50 border border-border-light rounded-lg p-3 mt-4 backdrop-blur-sm">
      This platform is an educational trading simulator. Prices, trades and market events are simulated and do not represent real financial markets.
    </div>
  );
}
