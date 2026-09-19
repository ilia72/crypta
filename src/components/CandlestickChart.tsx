import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Candle } from '../types';
import { formatPrice } from '../utils/formatters';

interface CandlestickChartProps {
  candles: Candle[];
  width?: number;
  height?: number;
  indicators?: {
    sma?: (number | null)[];
    ema?: (number | null)[];
    rsi?: (number | null)[];
    macd?: { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] };
    bollinger?: { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] };
  };
  activeIndicators: string[];
}

interface CrosshairData {
  x: number;
  y: number;
  candleIndex: number;
}

export function CandlestickChart({
  candles,
  width = 800,
  height = 400,
  indicators,
  activeIndicators,
}: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 20, h: 1 });
  const [crosshair, setCrosshair] = useState<CrosshairData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; vb: typeof viewBox } | null>(null);

  const padding = { top: 20, right: 60, bottom: 30, left: 10 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width || 800, height: rect.height || 400 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { priceMin, priceMax, volumeMax, timeStart, timeEnd } = useMemo(() => {
    if (candles.length === 0) return { priceMin: 0, priceMax: 1, volumeMax: 1, timeStart: 0, timeEnd: 1 };
    const prices = candles.flatMap((c) => [c.high, c.low]);
    const volumes = candles.map((c) => c.volume);
    return {
      priceMin: Math.min(...prices) * 0.99,
      priceMax: Math.max(...prices) * 1.01,
      volumeMax: Math.max(...volumes) * 1.1,
      timeStart: candles[0].time,
      timeEnd: candles[candles.length - 1].time,
    };
  }, [candles]);

  const candleWidth = useMemo(() => {
    if (candles.length === 0) return 4;
    return Math.max(2, Math.min(12, (chartWidth / candles.length) * 0.7));
  }, [candles.length, chartWidth]);

  const priceToY = useCallback((price: number) => {
    return padding.top + chartHeight - ((price - priceMin) / (priceMax - priceMin)) * chartHeight;
  }, [priceMin, priceMax, chartHeight, padding.top]);

  const timeToX = useCallback((time: number) => {
    return padding.left + ((time - timeStart) / (timeEnd - timeStart)) * chartWidth;
  }, [timeStart, timeEnd, chartWidth, padding.left]);

  const yToPrice = useCallback((y: number) => {
    return priceMin + ((padding.top + chartHeight - y) / chartHeight) * (priceMax - priceMin);
  }, [priceMin, priceMax, chartHeight, padding.top]);

  const xToTime = useCallback((x: number) => {
    return timeStart + ((x - padding.left) / chartWidth) * (timeEnd - timeStart);
  }, [timeStart, timeEnd, chartWidth, padding.left]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && dragStart) {
      const dx = x - dragStart.x;
      const timeRange = (viewBox.w / chartWidth) * (timeEnd - timeStart);
      const newTimeStart = timeStart - (dx / chartWidth) * timeRange;
      const newTimeEnd = newTimeStart + timeRange;
      setViewBox({ x: padding.left + ((newTimeStart - timeStart) / (timeEnd - timeStart)) * chartWidth, y: viewBox.y, w: viewBox.w, h: viewBox.h });
      return;
    }

    const time = xToTime(x);
    let closestIdx = -1;
    let closestDist = Infinity;
    candles.forEach((c, i) => {
      const dist = Math.abs(c.time - time);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    if (closestIdx >= 0 && closestIdx < candles.length) {
      const c = candles[closestIdx];
      setCrosshair({ x: timeToX(c.time), y, candleIndex: closestIdx });
    }
  }, [isDragging, dragStart, viewBox, chartWidth, timeStart, timeEnd, candles, xToTime, timeToX, padding.left]);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setIsDragging(true);
    setDragStart({ x, vb: { ...viewBox } });
  }, [viewBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const time = xToTime(x);
    const timeRange = (viewBox.w / chartWidth) * (timeEnd - timeStart);
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const newRange = Math.max(0.001, Math.min(timeEnd - timeStart, timeRange * zoomFactor));
    const ratio = (time - timeStart) / (timeEnd - timeStart);
    const newStart = time - ratio * newRange;
    const newEnd = newStart + newRange;
    setViewBox({
      x: padding.left + ((newStart - timeStart) / (timeEnd - timeStart)) * chartWidth,
      y: viewBox.y,
      w: (newRange / (timeEnd - timeStart)) * chartWidth,
      h: viewBox.h,
    });
  }, [viewBox, chartWidth, timeStart, timeEnd, xToTime, padding.left]);

  const visibleCandles = useMemo(() => {
    if (candles.length === 0) return [];
    const startIdx = Math.max(0, Math.floor(viewBox.x / chartWidth * candles.length));
    const endIdx = Math.min(candles.length, Math.ceil((viewBox.x + viewBox.w) / chartWidth * candles.length));
    return candles.slice(startIdx, endIdx);
  }, [candles, viewBox, chartWidth]);

  const visibleTimeStart = visibleCandles.length > 0 ? visibleCandles[0].time : timeStart;
  const visibleTimeEnd = visibleCandles.length > 0 ? visibleCandles[visibleCandles.length - 1].time : timeEnd;

  const priceRange = priceMax - priceMin;
  const displayPriceMin = priceMin;
  const displayPriceMax = priceMax;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="cursor-crosshair"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <clipPath id="chart-clip">
            <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} />
          </clipPath>
        </defs>

        {/* Background */}
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="#0d1117" rx="4" />

        {/* Grid lines */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = padding.top + (chartHeight / 4) * i;
          const price = yToPrice(y);
          return (
            <g key={`grid-${i}`}>
              <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="#21262d" strokeDasharray="2 2" />
              <text x={padding.left + chartWidth + 5} y={y + 4} fill="#484f58" fontSize="10" textAnchor="start">{formatPrice(price)}</text>
            </g>
          );
        })}

        {/* Time labels */}
        {visibleCandles.length > 0 && (
          <g>
            {visibleCandles.filter((_, i) => i % Math.max(1, Math.floor(visibleCandles.length / 6)) === 0).map((c, i) => {
              const idx = candles.indexOf(c);
              return (
                <text key={idx} x={timeToX(c.time)} y={padding.top + chartHeight + 15} fill="#484f58" fontSize="10" textAnchor="middle">{formatTime(c.time)}</text>
              );
            })}
          </g>
        )}

        {/* Candles */}
        <g clipPath="url(#chart-clip)">
          {visibleCandles.map((c, i) => {
            const x = timeToX(c.time);
            const isBullish = c.close >= c.open;
            const color = isBullish ? '#22c55e' : '#ef4444';
            const bodyTop = priceToY(Math.max(c.open, c.close));
            const bodyBottom = priceToY(Math.min(c.open, c.close));
            const bodyHeight = Math.max(1, bodyBottom - bodyTop);
            const wickTop = priceToY(c.high);
            const wickBottom = priceToY(c.low);

            return (
              <g key={i}>
                <line x1={x} y1={wickTop} x2={x} y2={wickBottom} stroke={color} strokeWidth={1} />
                <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={isBullish ? '#22c55e' : '#ef4444'} rx={1} opacity={0.8} />
              </g>
            );
          })}
        </g>

        {/* SMA */}
        {activeIndicators.includes('sma') && indicators?.sma && (
          <g clipPath="url(#chart-clip)">
            <polyline
              points={visibleCandles.map((c, i) => {
                const idx = candles.indexOf(c);
                const val = indicators.sma![idx];
                return val !== null ? `${timeToX(c.time)},${priceToY(val)}` : '';
              }).filter(Boolean).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          </g>
        )}

        {/* EMA */}
        {activeIndicators.includes('ema') && indicators?.ema && (
          <g clipPath="url(#chart-clip)">
            <polyline
              points={visibleCandles.map((c, i) => {
                const idx = candles.indexOf(c);
                const val = indicators.ema![idx];
                return val !== null ? `${timeToX(c.time)},${priceToY(val)}` : '';
              }).filter(Boolean).join(' ')}
              fill="none"
              stroke="#ec4899"
              strokeWidth={1.5}
            />
          </g>
        )}

        {/* Bollinger Bands */}
        {activeIndicators.includes('bollinger') && indicators?.bollinger && (
          <g clipPath="url(#chart-clip)">
            <polyline
              points={visibleCandles.map((c, i) => {
                const idx = candles.indexOf(c);
                const val = indicators.bollinger!.upper[i];
                return val !== null ? `${timeToX(c.time)},${priceToY(val)}` : '';
              }).filter(Boolean).join(' ')}
              fill="none" stroke="#64748b" strokeWidth={0.5} strokeDasharray="4 4"
            />
            <polyline
              points={visibleCandles.map((c, i) => {
                const idx = candles.indexOf(c);
                const val = indicators.bollinger!.lower[i];
                return val !== null ? `${timeToX(c.time)},${priceToY(val)}` : '';
              }).filter(Boolean).join(' ')}
              fill="none" stroke="#64748b" strokeWidth={0.5} strokeDasharray="4 4"
            />
          </g>
        )}

        {/* RSI */}
        {activeIndicators.includes('rsi') && indicators?.rsi && !activeIndicators.some(a => ['sma', 'ema', 'bollinger'].includes(a)) && (
          <g clipPath="url(#chart-clip)">
            <polyline
              points={visibleCandles.map((c, i) => {
                const idx = candles.indexOf(c);
                const val = indicators.rsi![idx];
                return val !== null ? `${timeToX(c.time)},${padding.top + chartHeight - (val / 100) * chartHeight}` : '';
              }).filter(Boolean).join(' ')}
              fill="none" stroke="#8b5cf6" strokeWidth={1.5}
            />
            <line x1={padding.left} y1={padding.top + chartHeight * 0.3} x2={padding.left + chartWidth} y2={padding.top + chartHeight * 0.3} stroke="#22c55e" strokeDasharray="4 4" opacity={0.5} />
            <line x1={padding.left} y1={padding.top + chartHeight * 0.7} x2={padding.left + chartWidth} y2={padding.top + chartHeight * 0.7} stroke="#ef4444" strokeDasharray="4 4" opacity={0.5} />
          </g>
        )}

        {/* MACD */}
        {activeIndicators.includes('macd') && indicators?.macd && !activeIndicators.some(a => ['sma', 'ema', 'bollinger', 'rsi'].includes(a)) && (
          <g clipPath="url(#chart-clip)">
            {(() => {
              const macdVals = indicators.macd!.macd.filter((v) => v !== null) as number[];
              const signalVals = indicators.macd!.signal.filter((v) => v !== null) as number[];
              const histVals = indicators.macd!.histogram.filter((v) => v !== null) as number[];
              if (macdVals.length === 0) return null;
              const allVals = [...macdVals, ...signalVals, ...histVals];
              const minVal = Math.min(...allVals);
              const maxVal = Math.max(...allVals);
              const range = maxVal - minVal || 1;
              const yScale = (v: number) => padding.top + chartHeight - ((v - minVal) / range) * chartHeight;
              return (
                <>
                  <line x1={padding.left} y1={padding.top + chartHeight / 2} x2={padding.left + chartWidth} y2={padding.top + chartHeight / 2} stroke="#21262d" />
                  {visibleCandles.map((c, i) => {
                    const idx = candles.indexOf(c);
                    const macdVal = indicators.macd!.macd[idx];
                    const signalVal = indicators.macd!.signal[idx];
                    const histVal = indicators.macd!.histogram[idx];
                    const x = timeToX(c.time);
                    return (
                      <g key={i}>
                        {macdVal !== null && <circle cx={x} cy={yScale(macdVal)} r={1.5} fill="#3b82f6" />}
                        {signalVal !== null && <circle cx={x} cy={yScale(signalVal)} r={1.5} fill="#ef4444" />}
                        {histVal !== null && (
                          <rect x={x - candleWidth / 2} y={yScale(Math.max(0, histVal))} width={candleWidth} height={Math.max(1, Math.abs(histVal / range) * chartHeight)} fill={histVal >= 0 ? '#22c55e' : '#ef4444'} opacity={0.6} />
                        )}
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </g>
        )}

        {/* Volume bars */}
        <g clipPath="url(#chart-clip)">
          {visibleCandles.map((c, i) => {
            const x = timeToX(c.time);
            const isBullish = c.close >= c.open;
            const volHeight = (c.volume / volumeMax) * 40;
            const y = padding.top + chartHeight - volHeight;
            return (
              <rect key={`vol-${i}`} x={x - candleWidth / 2} y={y} width={candleWidth} height={volHeight} fill={isBullish ? '#22c55e' : '#ef4444'} opacity={0.2} rx={1} />
            );
          })}
        </g>

        {/* Crosshair */}
        {crosshair && (
          <>
            <line x1={crosshair.x} y1={padding.top} x2={crosshair.x} y2={padding.top + chartHeight} stroke="#3b82f6" strokeWidth={0.5} strokeDasharray="3 3" />
            <line x1={padding.left} y1={crosshair.y} x2={padding.left + chartWidth} y2={crosshair.y} stroke="#3b82f6" strokeWidth={0.5} strokeDasharray="3 3" />
            {crosshair.candleIndex >= 0 && crosshair.candleIndex < candles.length && (
              <g>
                {(() => {
                  const c = candles[crosshair.candleIndex];
                  const isBullish = c.close >= c.open;
                  const color = isBullish ? '#22c55e' : '#ef4444';
                  return (
                    <>
                      <rect x={crosshair.x - candleWidth / 2} y={priceToY(Math.max(c.open, c.close))} width={candleWidth} height={Math.max(1, priceToY(Math.min(c.open, c.close)) - priceToY(Math.max(c.open, c.close)))} fill={color} opacity={0.9} />
                      <line x1={crosshair.x} y1={priceToY(c.high)} x2={crosshair.x} y2={priceToY(c.low)} stroke={color} strokeWidth={1} />
                    </>
                  );
                })()}
              </g>
            )}
          </>
        )}
      </svg>

      {/* Tooltip */}
      {crosshair && crosshair.candleIndex >= 0 && crosshair.candleIndex < candles.length && (
        <div
          className="absolute bg-bg-panel border border-border-light rounded-lg p-2 text-xs pointer-events-none z-10 shadow-card"
          style={{ left: `${Math.min(crosshair.x + 10, dimensions.width - 160)}px`, top: `${crosshair.y - 60}px` }}
        >
          {(() => {
            const c = candles[crosshair.candleIndex];
            const isBullish = c.close >= c.open;
            return (
              <>
                <div className="font-bold" style={{ color: isBullish ? '#22c55e' : '#ef4444' }}>{isBullish ? '▲' : '▼'} {formatPrice(c.close)}</div>
                <div className="text-text-muted">O: {formatPrice(c.open)}</div>
                <div className="text-text-muted">H: {formatPrice(c.high)}</div>
                <div className="text-text-muted">L: {formatPrice(c.low)}</div>
                <div className="text-text-muted">V: {c.volume.toFixed(0)}</div>
              </>
            );
          })()}
        </div>
      )}

      <div className="absolute bottom-2 left-2 text-[10px] text-text-muted">Scroll to zoom · Drag to pan</div>
    </div>
  );
}
