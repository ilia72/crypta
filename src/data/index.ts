import type { CoinData, Lesson, Challenge, Badge } from '../types';

export const COINS: CoinData[] = [
  {
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64250.00, prevPrice: 64250.00,
    change24h: 2.34, change7d: 5.12, volume24h: 28500000000, marketCap: 1265000000000,
    high24h: 65100.00, low24h: 63200.00, category: 'Layer 1', rank: 1, icon: '₿',
  },
  {
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3150.00, prevPrice: 3150.00,
    change24h: -1.23, change7d: 3.45, volume24h: 14200000000, marketCap: 378000000000,
    high24h: 3220.00, low24h: 3080.00, category: 'Layer 1', rank: 2, icon: 'Ξ',
  },
  {
    id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.80, prevPrice: 145.80,
    change24h: 4.56, change7d: 12.30, volume24h: 3200000000, marketCap: 67000000000,
    high24h: 152.00, low24h: 138.50, category: 'Layer 1', rank: 5, icon: '◎',
  },
  {
    id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 585.00, prevPrice: 585.00,
    change24h: 0.89, change7d: -2.10, volume24h: 1800000000, marketCap: 89000000000,
    high24h: 595.00, low24h: 575.00, category: 'Layer 1', rank: 4, icon: 'B',
  },
  {
    id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0.52, prevPrice: 0.52,
    change24h: -0.45, change7d: 1.20, volume24h: 1500000000, marketCap: 29000000000,
    high24h: 0.54, low24h: 0.50, category: 'Layer 1', rank: 6, icon: '✕',
  },
  {
    id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.42, prevPrice: 0.42,
    change24h: 1.78, change7d: -3.45, volume24h: 850000000, marketCap: 15000000000,
    high24h: 0.44, low24h: 0.41, category: 'Layer 1', rank: 8, icon: '₳',
  },
  {
    id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.12, prevPrice: 0.12,
    change24h: 6.23, change7d: 15.40, volume24h: 2100000000, marketCap: 17000000000,
    high24h: 0.13, low24h: 0.11, category: 'Layer 1', rank: 9, icon: 'Ð',
  },
  {
    id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 28.50, prevPrice: 28.50,
    change24h: -2.10, change7d: 4.50, volume24h: 680000000, marketCap: 11200000000,
    high24h: 29.80, low24h: 27.20, category: 'Layer 1', rank: 10, icon: '△',
  },
  {
    id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 14.20, prevPrice: 14.20,
    change24h: 3.12, change7d: 8.90, volume24h: 420000000, marketCap: 8400000000,
    high24h: 14.80, low24h: 13.50, category: 'DeFi', rank: 12, icon: '⬡',
  },
  {
    id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 6.85, prevPrice: 6.85,
    change24h: -0.95, change7d: 2.30, volume24h: 280000000, marketCap: 9600000000,
    high24h: 7.10, low24h: 6.60, category: 'Layer 1', rank: 13, icon: '●',
  },
  {
    id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, prevPrice: 1.00,
    change24h: 0.01, change7d: 0.00, volume24h: 52000000000, marketCap: 112000000000,
    high24h: 1.001, low24h: 0.999, category: 'Stablecoins', rank: 3, icon: '₮',
  },
  {
    id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, prevPrice: 1.00,
    change24h: 0.00, change7d: 0.00, volume24h: 8900000000, marketCap: 34000000000,
    high24h: 1.001, low24h: 0.999, category: 'Stablecoins', rank: 7, icon: '◉',
  },
  {
    id: 'polygon', symbol: 'MATIC', name: 'Polygon', price: 0.58, prevPrice: 0.58,
    change24h: 1.45, change7d: -1.80, volume24h: 380000000, marketCap: 5600000000,
    high24h: 0.60, low24h: 0.56, category: 'Layer 2', rank: 14, icon: '⬢',
  },
  {
    id: 'uniswap', symbol: 'UNI', name: 'Uniswap', price: 7.85, prevPrice: 7.85,
    change24h: 2.67, change7d: 6.40, volume24h: 150000000, marketCap: 4700000000,
    high24h: 8.10, low24h: 7.50, category: 'DeFi', rank: 15, icon: '🦄',
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'l1', title: 'What is Bitcoin?', category: 'beginner',
    description: 'Learn about the first and most famous cryptocurrency.',
    content: 'Bitcoin is a decentralized digital currency created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It operates on a peer-to-peer network without intermediaries, using blockchain technology to record transactions. Bitcoin has a fixed supply of 21 million coins, making it deflationary. It is often called "digital gold" due to its scarcity and store-of-value properties.',
    quiz: [
      { question: 'Who created Bitcoin?', options: ['Satoshi Nakamoto', 'Elon Musk', 'Vitalik Buterin', 'Charles Hoskinson'], correct: 0 },
      { question: 'What is Bitcoin\'s maximum supply?', options: ['10 million', '21 million', '100 million', 'Unlimited'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l2', title: 'What is Ethereum?', category: 'beginner',
    description: 'Understand the world\'s leading smart contract platform.',
    content: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Launched in 2015 by Vitalik Buterin, it introduced programmable blockchains where developers can build decentralized applications (dApps). Ether (ETH) is the native currency used to pay for transactions and computational services on the network.',
    quiz: [
      { question: 'Who founded Ethereum?', options: ['Satoshi Nakamoto', 'Vitalik Buterin', 'Charles Hoskinson', 'Gavin Wood'], correct: 1 },
      { question: 'What are self-executing contracts on Ethereum called?', options: ['DAOs', 'Smart contracts', 'Tokens', 'Oracles'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l3', title: 'What is Blockchain?', category: 'beginner',
    description: 'The foundational technology behind all cryptocurrencies.',
    content: 'Blockchain is a distributed, immutable ledger that records transactions across a network of computers. Each "block" contains a batch of transactions, and blocks are linked in a "chain." This structure ensures transparency and security — once data is recorded, it cannot be altered without consensus from the network. Blockchain enables trustless transactions between parties who may not know or trust each other.',
    quiz: [
      { question: 'What is a blockchain?', options: ['A type of database', 'A physical chain', 'A trading strategy', 'A wallet type'], correct: 0 },
      { question: 'Can blockchain data be easily changed?', options: ['Yes, anytime', 'Only by the creator', 'No, it is immutable', 'Only on weekends'], correct: 2 },
    ],
    completed: false,
  },
  {
    id: 'l4', title: 'What is a Crypto Wallet?', category: 'beginner',
    description: 'How to store and manage your digital assets.',
    content: 'A crypto wallet is a tool that stores your private keys — the secret codes that prove ownership of your cryptocurrencies. Wallets come in two main types: hot wallets (connected to the internet, like mobile apps) and cold wallets (offline storage, like hardware devices). Your wallet address is like an email address you share to receive funds, while your private key is like your password — never share it.',
    quiz: [
      { question: 'What does a crypto wallet actually store?', options: ['Coins physically', 'Private keys', 'Bank accounts', 'Passwords only'], correct: 1 },
      { question: 'What is a cold wallet?', options: ['Internet-connected', 'Offline storage', 'A type of exchange', 'A paper receipt'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l5', title: 'What is an Exchange?', category: 'beginner',
    description: 'Where traders buy and sell cryptocurrencies.',
    content: 'A cryptocurrency exchange is a platform that allows users to buy, sell, and trade digital assets. Centralized exchanges (CEX) like Binance or Coinbase operate like traditional stock exchanges, while decentralized exchanges (DEX) let users trade directly from their wallets through smart contracts. Exchanges charge fees for transactions and provide liquidity to the market.',
    quiz: [
      { question: 'What does CEX stand for?', options: ['Crypto Exchange', 'Centralized Exchange', 'Computer Exchange', 'Credit Exchange'], correct: 1 },
      { question: 'What is a DEX?', options: ['Decentralized Exchange', 'Digital Exchange', 'Direct Exchange', 'Dynamic Exchange'], correct: 0 },
    ],
    completed: false,
  },
  {
    id: 'l6', title: 'What is a Trading Pair?', category: 'beginner',
    description: 'Understanding how assets are traded against each other.',
    content: 'A trading pair is a combination of two assets that can be traded against each other on an exchange. For example, BTC/USDT means you can trade Bitcoin against Tether (a stablecoin pegged to the US dollar). The first asset is the base currency and the second is the quote currency. When you buy BTC/USDT, you are buying Bitcoin using USDT.',
    quiz: [
      { question: 'In BTC/USDT, which is the base currency?', options: ['USDT', 'BTC', 'Both', 'Neither'], correct: 1 },
      { question: 'What does ETH/USD mean?', options: ['Trade Ethereum for US dollars', 'Trade USD for Ethereum', 'Ethereum wallet address', 'Ethereum deposit'], correct: 0 },
    ],
    completed: false,
  },
  {
    id: 'l7', title: 'Market Orders vs Limit Orders', category: 'beginner',
    description: 'Two fundamental ways to place trades.',
    content: 'A market order buys or sells immediately at the current market price. It guarantees execution but not the exact price. A limit order sets a specific price — you buy only at or below your limit, or sell only at or above your limit. Limit orders may not execute if the price never reaches your specified level, but they give you price control.',
    quiz: [
      { question: 'Which order executes immediately at the best available price?', options: ['Limit order', 'Market order', 'Stop order', 'Iceberg order'], correct: 1 },
      { question: 'What is the advantage of a limit order?', options: ['Faster execution', 'Price control', 'No fees', 'Guaranteed fill'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l8', title: 'Candlestick Basics', category: 'beginner',
    description: 'Read price charts like a professional trader.',
    content: 'A candlestick chart shows price movement over time. Each candle has a body (open and close prices) and wicks (high and low prices). A green/bullish candle means the price went up during that period; a red/bearish candle means it went down. Long bodies indicate strong momentum, while short bodies indicate indecision. Doji candles have nearly equal open and close.',
    quiz: [
      { question: 'What does a green candle typically indicate?', options: ['Price went down', 'Price went up', 'No change', 'High volume'], correct: 1 },
      { question: 'What are the wicks on a candle?', options: ['Open and close prices', 'High and low prices', 'Volume data', 'Fee information'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l9', title: 'Support and Resistance', category: 'beginner',
    description: 'Key concepts for understanding price movements.',
    content: 'Support is a price level where a coin tends to stop falling because buyers step in. Resistance is a price level where selling pressure prevents the price from rising further. These levels act like a floor (support) and ceiling (resistance). When price breaks through resistance, it often becomes new support, and vice versa. Traders use these levels to make buy and sell decisions.',
    quiz: [
      { question: 'What is a support level?', options: ['Where price tends to stop rising', 'Where price tends to stop falling', 'The highest price ever', 'The opening price'], correct: 1 },
      { question: 'When price breaks through resistance, what does it often become?', options: ['New resistance', 'New support', 'Unchanged', 'Invalid'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l10', title: 'Risk Management', category: 'beginner',
    description: 'Protect your capital and trade responsibly.',
    content: 'Risk management is crucial for long-term trading success. Key principles include: never risk more than 1-2% of your capital on a single trade, always use stop losses, maintain a favorable risk/reward ratio (at least 1:2), and diversify your portfolio. Emotional discipline is equally important — stick to your plan even when emotions run high.',
    quiz: [
      { question: 'What percentage of capital should you typically risk per trade?', options: ['10-20%', '5-10%', '1-2%', '50%'], correct: 2 },
      { question: 'What is a stop loss?', options: ['A profit target', 'An automatic exit to limit losses', 'A type of coin', 'A trading signal'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l11', title: 'Trend Analysis', category: 'intermediate',
    description: 'Identify and ride market trends.',
    content: 'A trend is the general direction of price movement. Uptrends feature higher highs and higher lows; downtrends feature lower highs and lower lows; sideways trends (ranges) lack clear direction. Trend lines connect significant price points to visualize the trend. Trading with the trend (trend following) is generally more profitable than trading against it.',
    quiz: [
      { question: 'What characterizes an uptrend?', options: ['Lower highs and lower lows', 'Higher highs and higher lows', 'Flat price action', 'High volume only'], correct: 1 },
      { question: 'What is the general rule about trading with trends?', options: ['Trade against the trend', 'Trade with the trend', 'Ignore trends', 'Only trade sideways'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l12', title: 'RSI (Relative Strength Index)', category: 'intermediate',
    description: 'Measure momentum and overbought/oversold conditions.',
    content: 'RSI is a momentum oscillator that ranges from 0 to 100. Values above 70 suggest an asset may be overbought (potential sell signal), while values below 30 suggest oversold (potential buy signal). RSI can also show divergences — when price makes a new high but RSI does not, the trend may be weakening. The default period is 14 candles.',
    quiz: [
      { question: 'What RSI value suggests an asset is overbought?', options: ['Below 30', '50', 'Above 70', '100'], correct: 2 },
      { question: 'What is the default RSI period?', options: ['7', '14', '30', '90'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l13', title: 'MACD (Moving Average Convergence Divergence)', category: 'intermediate',
    description: 'A powerful trend-following momentum indicator.',
    content: 'MACD consists of three components: the MACD line (12-period EMA minus 26-period EMA), the Signal line (9-period EMA of MACD line), and the histogram (difference between MACD and Signal). When MACD crosses above Signal, it is a bullish signal. When it crosses below, it is bearish. The histogram shows momentum strength and can reveal divergences.',
    quiz: [
      { question: 'What does MACD crossing above Signal indicate?', options: ['Bearish signal', 'Bullish signal', 'No signal', 'Market closed'], correct: 1 },
      { question: 'How many components does MACD have?', options: ['2', '3', '4', '5'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l14', title: 'Moving Averages', category: 'intermediate',
    description: 'Smooth out price data to identify trends.',
    content: 'Moving averages (MAs) smooth price data over a specified period. The Simple Moving Average (SMA) calculates the arithmetic mean, while the Exponential Moving Average (EMA) gives more weight to recent prices. Common periods are 50, 100, and 200. When a short MA crosses above a long MA (Golden Cross), it signals bullish momentum; the reverse (Death Cross) is bearish.',
    quiz: [
      { question: 'What is the difference between SMA and EMA?', options: ['SMA is faster', 'EMA gives more weight to recent prices', 'They are identical', 'EMA uses fewer periods'], correct: 1 },
      { question: 'What is a Golden Cross?', options: ['Short MA crosses below long MA', 'Short MA crosses above long MA', 'Price crosses above MA', 'MA crosses volume'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l15', title: 'Trading Volume', category: 'intermediate',
    description: 'Understand the importance of trade volume.',
    content: 'Volume measures the number of shares or contracts traded during a period. High volume confirms trends — a price move with high volume is more reliable. Low volume suggests weak conviction. Volume spikes often precede significant price moves. Breakouts on high volume are more trustworthy than those on low volume.',
    quiz: [
      { question: 'High volume during a price move typically indicates:', options: ['Weak conviction', 'Strong conviction', 'A bug', 'Low interest'], correct: 1 },
      { question: 'What does a volume spike often precede?', options: ['Nothing', 'Significant price moves', 'Exchange closure', 'Tax deadline'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l16', title: 'Breakouts', category: 'intermediate',
    description: 'Trade when price breaks key levels.',
    content: 'A breakout occurs when price moves decisively above resistance or below support, often on increased volume. Breakouts can signal the start of a new trend. However, fakeouts (false breakouts) are common — price briefly breaks a level then reverses. To confirm breakouts, wait for the price to hold above/below the level and watch for volume confirmation.',
    quiz: [
      { question: 'What is a breakout?', options: ['Price staying in range', 'Price breaking above resistance or below support', 'A type of coin', 'An exchange feature'], correct: 1 },
      { question: 'What is a fakeout?', options: ['A real breakout', 'A false breakout', 'A profit', 'A volume spike'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l17', title: 'Stop Loss', category: 'intermediate',
    description: 'Protect your trades from large losses.',
    content: 'A stop loss is an order that automatically closes your position when the price reaches a specified level, limiting your potential loss. For long positions, the stop loss is placed below the entry price; for short positions, above. The distance between entry and stop loss determines your risk per trade. Always set stop losses before entering a position.',
    quiz: [
      { question: 'Where is a stop loss placed for a long position?', options: ['Above entry price', 'Below entry price', 'At the high', 'At zero'], correct: 1 },
      { question: 'What does a stop loss limit?', options: ['Potential profit', 'Potential loss', 'Trading fees', 'Order size'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l18', title: 'Take Profit', category: 'intermediate',
    description: 'Lock in gains at predetermined levels.',
    content: 'A take profit (TP) order automatically closes your position when the price reaches a target level, securing your profits. TP levels are often set using support/resistance, risk/reward ratios, or technical indicators. Having a TP prevents you from holding too long and giving back profits. A common TP placement is at a 2:1 or 3:1 risk/reward ratio.',
    quiz: [
      { question: 'What does a take profit order do?', options: ['Limits losses', 'Locks in gains', 'Increases leverage', 'Cancels other orders'], correct: 1 },
      { question: 'At what ratio is TP commonly set?', options: ['1:1', '2:1 or 3:1', '10:1', '0.5:1'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l19', title: 'Position Sizing', category: 'intermediate',
    description: 'Determine the right trade size for your capital.',
    content: 'Position sizing determines how much capital to allocate to each trade. Proper sizing protects your account from large drawdowns. A common method: risk 1-2% of your total capital per trade. If your account is $10,000 and you risk 1%, your maximum loss per trade is $100. Calculate position size as: (Account Risk / (Entry Price - Stop Loss Price)).',
    quiz: [
      { question: 'If you have $10,000 and risk 1%, what is your max loss per trade?', options: ['$10', '$100', '$1,000', '$10,000'], correct: 1 },
      { question: 'Position sizing primarily protects against:', options: ['Missing opportunities', 'Large drawdowns', 'High fees', 'Slow execution'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l20', title: 'Risk/Reward Ratio', category: 'intermediate',
    description: 'Measure the quality of a trade setup.',
    content: 'The risk/reward ratio compares potential loss to potential gain. A ratio of 1:2 means you risk $1 to potentially gain $2. Traders generally seek ratios of at least 1:2 or 1:3. Even with a 40% win rate, a 1:3 ratio can be profitable. Calculate: Risk = Entry - Stop Loss; Reward = Take Profit - Entry; Ratio = Reward / Risk.',
    quiz: [
      { question: 'What does a 1:2 risk/reward mean?', options: ['Risk $2 to gain $1', 'Risk $1 to gain $2', 'Risk equals reward', '2% risk, 2% reward'], correct: 1 },
      { question: 'What is the minimum R:R ratio most traders seek?', options: ['1:1', '1:2', '1:5', '1:10'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l21', title: 'Technical Analysis', category: 'advanced',
    description: 'Deep dive into chart-based trading strategies.',
    content: 'Technical analysis (TA) uses historical price and volume data to forecast future price movements. It relies on the premise that history tends to repeat itself, price moves in trends, and market action discounts everything. Tools include chart patterns (head and shoulders, double tops/bottoms), indicators (RSI, MACD, Bollinger Bands), and volume analysis. TA is not an exact science — combine it with risk management.',
    quiz: [
      { question: 'What does TA assume about price?', options: ['Random walk', 'Moves in trends', 'Always goes up', 'Follows GDP'], correct: 1 },
      { question: 'What is a double top pattern?', options: ['Bullish reversal', 'Bearish reversal', 'Continuation', 'No significance'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l22', title: 'Market Structure', category: 'advanced',
    description: 'Understand how markets are organized.',
    content: 'Market structure refers to how a market is organized — number of participants, barriers to entry, product differentiation, and information flow. Crypto markets are relatively new and less regulated than traditional markets, leading to higher volatility and opportunity. Understanding market structure helps identify who controls price: retail traders, institutions, or market makers.',
    quiz: [
      { question: 'Why are crypto markets more volatile than traditional markets?', options: ['Lower regulation and participation', 'They are always up', 'No technology', 'Government control'], correct: 0 },
      { question: 'Who are market makers?', options: ['People who buy only', 'People who provide liquidity', 'Regulators', 'Tax collectors'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l23', title: 'Liquidity', category: 'advanced',
    description: 'How easily assets can be bought or sold.',
    content: 'Liquidity refers to how easily an asset can be bought or sold without significantly affecting its price. High liquidity means tight spreads and stable prices; low liquidity means wider spreads and more price volatility. Major coins like BTC and ETH have high liquidity, while small-cap altcoins often have low liquidity. Always consider liquidity when sizing positions.',
    quiz: [
      { question: 'What does high liquidity mean?', options: ['Hard to trade', 'Easy to trade with minimal price impact', 'No trading fees', 'High risk'], correct: 1 },
      { question: 'Which coins typically have the highest liquidity?', options: ['Small-cap altcoins', 'Major coins like BTC and ETH', 'New tokens', 'Dead coins'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l24', title: 'Volatility', category: 'advanced',
    description: 'Understand price fluctuation and its implications.',
    content: 'Volatility measures how much a coin\'s price fluctuates over time. High volatility means larger price swings (more risk and opportunity); low volatility means smaller swings. Implied volatility is forward-looking (expected future moves), while historical volatility looks at past moves. Traders can profit from both rising and falling volatility through options and appropriate position sizing.',
    quiz: [
      { question: 'High volatility means:', options: ['Small price swings', 'Large price swings', 'No price change', 'Fixed prices'], correct: 1 },
      { question: 'What is implied volatility?', options: ['Past volatility', 'Expected future volatility', 'Current price', 'Exchange fee'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l25', title: 'Trading Psychology', category: 'advanced',
    description: 'Master the mental game of trading.',
    content: 'Trading psychology is often the biggest factor in success or failure. Fear and greed are the two dominant emotions — fear causes traders to exit too early or avoid trades, while greed causes overtrading or ignoring stop losses. Key principles: follow your trading plan, accept losses as a cost, avoid revenge trading, take breaks, and maintain a trading journal. Emotional discipline separates profitable traders from losers.',
    quiz: [
      { question: 'What emotion causes traders to exit too early?', options: ['Greed', 'Fear', 'Excitement', 'Indifference'], correct: 1 },
      { question: 'What is revenge trading?', options: ['Trading for fun', 'Trading to recover losses impulsively', 'Long-term strategy', 'Diversification'], correct: 1 },
    ],
    completed: false,
  },
  {
    id: 'l26', title: 'Strategy Backtesting', category: 'advanced',
    description: 'Test your strategies before risking real capital.',
    content: 'Backtesting applies a trading strategy to historical data to evaluate its performance before using it in live markets. You define entry/exit rules, apply them to past price data, and analyze results including win rate, average profit/loss, max drawdown, and Sharpe ratio. Important: avoid overfitting (curve-fitting) where a strategy works perfectly on past data but fails in live markets.',
    quiz: [
      { question: 'What is backtesting?', options: ['Trading live', 'Testing strategy on historical data', 'Guessing prices', 'Reading news'], correct: 1 },
      { question: 'What is overfitting?', options: ['Good strategy', 'Strategy that works on past data but fails live', 'Low risk', 'High profit'], correct: 1 },
    ],
    completed: false,
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1', title: 'Buy BTC Using a Market Order', xp: 100, completed: false,
    description: 'Purchase Bitcoin using a market order on the trading terminal.',
    instructions: ['Open the Trading terminal', 'Select BTC', 'Place a market buy order for at least $500', 'Confirm the order'],
  },
  {
    id: 'c2', title: 'Create a Limit Order', xp: 100, completed: false,
    description: 'Place a limit order to buy at a specific price.',
    instructions: ['Open the Trading terminal', 'Select ETH', 'Switch to Limit order type', 'Set a price below current market', 'Place the order'],
  },
  {
    id: 'c3', title: 'Set a Stop Loss', xp: 150, completed: false,
    description: 'Open a position with a stop loss to protect against downside.',
    instructions: ['Open the Trading terminal', 'Select any coin', 'Place a trade with Stop Loss enabled', 'Set the stop loss at least 2% below entry', 'Execute the trade'],
  },
  {
    id: 'c4', title: 'Find a Possible Support Level', xp: 120, completed: false,
    description: 'Identify a support level on a chart and explain your reasoning.',
    instructions: ['Open the Trading terminal chart', 'Select a coin with clear price history', 'Identify a price level where price bounced multiple times', 'Note the support level', 'Place a buy order near that level'],
  },
  {
    id: 'c5', title: 'Calculate a 2:1 Risk/Reward Setup', xp: 150, completed: false,
    description: 'Create a trade with at least a 2:1 risk/reward ratio.',
    instructions: ['Open the Trading terminal', 'Select a coin', 'Set entry price, stop loss, and take profit', 'Ensure reward is at least 2x the risk', 'Place the trade'],
  },
  {
    id: 'c6', title: 'Build a Diversified Demo Portfolio', xp: 200, completed: false,
    description: 'Hold positions in at least 4 different cryptocurrencies.',
    instructions: ['Open the Trading terminal', 'Buy at least 4 different coins', 'Each position should be at least $200', 'Monitor your portfolio allocation', 'Maintain all positions for 5 minutes'],
  },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Trade', icon: 'trending-up', description: 'Placed your first trade', earned: false },
  { id: 'b2', name: 'Scholar', icon: 'book-open', description: 'Completed 5 lessons', earned: false },
  { id: 'b3', name: 'Mastermind', icon: 'brain', description: 'Completed all lessons', earned: false },
  { id: 'b4', name: 'Challenger', icon: 'trophy', description: 'Completed 3 challenges', earned: false },
  { id: 'b5', name: 'Diversified', icon: 'layers', description: 'Held 4+ different coins', earned: false },
  { id: 'b6', name: 'Risk Manager', icon: 'shield', description: 'Used stop loss on 5 trades', earned: false },
];
