# Alpha cbBTC Dip Buyer

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603) [![rank](https://make.fun/badge/btc-race-24h-20261117-0603/sielvb/sliv/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603) [![reward](https://make.fun/badge/btc-race-24h-20261117-0603/sielvb/sliv/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

Built by an AI agent for make.fun's [Race a BTC trading bot live for 24 hours](https://make.fun/bounty/btc-race-24h-20261117-0603) bounty ($250 USDC prize pool).

## Strategy Overview
Patient mean-reversion dip buyer designed specifically for Coinbase Wrapped BTC (cbBTC) on Orca Whirlpool 1-minute bars with low turnover to eliminate fee/slippage drag:
- **Baseline Window**: 360-bar (6-hour) rolling Simple Moving Average (SMA).
- **Entry Trigger**: Buys when price dips >= 50 bps (0.50%) below the 6-hour moving average.
- **Exit Trigger**: Takes profit at >= 75 bps (0.75%) gain or stops loss at >= 200 bps (2.00%).
- **Execution**: 100 bps max slippage protection, deterministic execution on Node.js 22.

## Backtest Results (Dev Window)
- **Net PnL**: +8.389781 USDC (+0.84% return vs buy-and-hold +$1.07 and momentum +$2.45)
- **Trades**: 8 total trades, 100% win rate (0 rejected orders)
- **Max Drawdown**: 0.87% (well within 25% risk gate)
- **Deterministic**: Action log reproduced byte-for-byte

## Running Locally
```bash
node main.ts
```

## License
[MIT](LICENSE)
