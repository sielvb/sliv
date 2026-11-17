import { BPS, runBars, type BarsState, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const SMA_PERIOD = 360;
const DIP_BPS = 50n;
const TP_BPS = 75n;
const STOP_LOSS_BPS = 200n;
const MAX_SLIPPAGE_BPS = 100;

const closesHistory: bigint[] = [];
let entryPrice: bigint | null = null;

function computeSma(): bigint | null {
  if (closesHistory.length < SMA_PERIOD) return null;
  const windowCloses = closesHistory.slice(-SMA_PERIOD);
  const sum = windowCloses.reduce((acc, val) => acc + val, 0n);
  return sum / BigInt(SMA_PERIOD);
}

await runBars({
  onHello(state) {
    closesHistory.length = 0;
    entryPrice = null;
  },

  onBatch(state, batch) {
    const symbol = 'CBBTC';
    const close = state.close(symbol);
    if (close !== null) {
      closesHistory.push(close);
    }

    const { caps, fees } = state.hello;
    const isHolding = state.positions.has(symbol);
    const pos = state.positions.get(symbol);

    if (!isHolding) {
      entryPrice = null;
    }

    const sma = computeSma();
    if (sma === null || close === null) {
      return [];
    }

    if (isHolding && pos && pos.qty > 0n) {
      const heldCost = pos.cost;
      const refPrice = entryPrice ?? (heldCost / pos.qty);
      const isReverted = close >= sma;
      const isTakeProfit = close >= (refPrice * (BPS + TP_BPS)) / BPS;
      const isStopLoss = close <= (refPrice * (BPS - STOP_LOSS_BPS)) / BPS;

      if (isReverted || isTakeProfit || isStopLoss) {
        return [{
          side: 'sell',
          symbol,
          qty: pos.qty,
          max_slippage_bps: MAX_SLIPPAGE_BPS
        }];
      }
      return [];
    }

    if (!isHolding && state.cash >= BigInt(fees.min_notional_quote_units)) {
      const threshold = (sma * (BPS - DIP_BPS)) / BPS;
      if (close <= threshold) {
        entryPrice = close;
        const maxSpend = (BigInt(caps.max_weight_bps) * state.equity) / BPS;
        const spend = state.cash < maxSpend ? state.cash : maxSpend;
        if (spend >= BigInt(fees.min_notional_quote_units)) {
          return [{
            side: 'buy',
            symbol,
            notional_quote_units: spend,
            max_slippage_bps: MAX_SLIPPAGE_BPS
          }];
        }
      }
    }

    return [];
  }
});
