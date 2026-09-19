export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const slice = data.slice(0, period);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    } else {
      const prev = result[i - 1]!;
      result.push(data[i] * multiplier + prev * (1 - multiplier));
    }
  }
  return result;
}

export function calculateRSI(data: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
      continue;
    }
    let gains = 0;
    let losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j] - data[j - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    }
  }
  return result;
}

export function calculateMACD(data: number[]): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macd: (number | null)[] = [];
  const signal: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (ema12[i] === null || ema26[i] === null) {
      macd.push(null);
      signal.push(null);
      histogram.push(null);
    } else {
      const m = ema12[i]! - ema26[i]!;
      macd.push(m);
      if (i === 25) {
        let sum = 0;
        for (let j = i - 8; j <= i; j++) {
          if (macd[j] !== null) sum += macd[j]!;
        }
        signal.push(sum / 9);
      } else if (i > 25) {
        const prev = signal[i - 1]!;
        signal.push(m * (2 / 10) + prev * (8 / 10));
      } else {
        signal.push(null);
      }
      if (signal[i] !== null && macd[i] !== null) {
        histogram.push(macd[i]! - signal[i]!);
      } else {
        histogram.push(null);
      }
    }
  }
  return { macd, signal, histogram };
}

export function calculateBollingerBands(
  data: number[], period: number = 20, stdDev: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const sma = calculateSMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (sma[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const variance = slice.reduce((s, v) => s + Math.pow(v - sma[i]!, 2), 0) / period;
      upper.push(sma[i]! + stdDev * Math.sqrt(variance));
      lower.push(sma[i]! - stdDev * Math.sqrt(variance));
    }
  }
  return { upper, middle: sma, lower };
}
