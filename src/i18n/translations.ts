export type Language = 'en' | 'ru';

interface Translations {
  // Navigation
  dashboard: string;
  markets: string;
  trade: string;
  portfolio: string;
  history: string;
  watchlist: string;
  news: string;
  learn: string;
  guide: string;
  challenges: string;
  settings: string;

  // Common
  simulated: string;
  disclaimer: string;
  close: string;
  cancel: string;
  confirm: string;
  delete: string;
  add: string;
  remove: string;
  search: string;
  filter: string;
  sort: string;

  // Dashboard
  portfolioValue: string;
  availableBalance: string;
  totalPnl: string;
  todayPnl: string;
  marketCap: string;
  volume24h: string;
  btcDominance: string;
  openPositions: string;
  welcomeBack: string;
  searchCoins: string;
  noPositions: string;
  noTrades: string;
  noWatchlist: string;
  allocation: string;
  marketOverview: string;
  recentTrades: string;
  watchlistTitle: string;

  // Trade
  tradingTerminal: string;
  buy: string;
  sell: string;
  market: string;
  limit: string;
  stopLoss: string;
  takeProfit: string;
  price: string;
  quantity: string;
  leverage: string;
  estimatedCost: string;
  fees: string;
  available: string;
  potentialProfit: string;
  potentialLoss: string;
  riskReward: string;
  placeOrder: string;
  orderSummary: string;
  stopLossOptional: string;
  takeProfitOptional: string;
  indicators: string;
  openOrders: string;
  tradeHistory: string;
  asset: string;
  side: string;
  type: string;
  entry: string;
  exit: string;
  pnl: string;
  pnlPct: string;
  action: string;
  closePosition: string;

  // Portfolio
  totalBalance: string;
  unrealizedPnl: string;
  winRate: string;
  riskRewardLabel: string;
  totalTrades: string;
  realizedPnl: string;
  avgProfit: string;
  avgLoss: string;
  assetAllocation: string;
  tradePerformance: string;
  holdings: string;
  noHoldings: string;
  entryPrice: string;
  current: string;
  value: string;

  // History
  tradeHistoryTitle: string;
  date: string;
  assetLabel: string;
  noTradesFound: string;

  // Watchlist
  trackCoins: string;
  addToWatchlist: string;
  high: string;
  low: string;
  volume: string;

  // Settings
  settingsTitle: string;
  appearance: string;
  trading: string;
  notifications: string;
  account: string;
  darkMode: string;
  currencyDisplay: string;
  simulationSpeed: string;
  enableNotifications: string;
  currentBalance: string;
  startingBalance: string;
  dangerZone: string;
  resetDemoAccount: string;
  resetDescription: string;
  confirmReset: string;
  resetWarning: string;

  // Learn
  learnTitle: string;
  all: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  expand: string;
  completed: string;
  markAsComplete: string;
  quiz: string;
  correct: string;
  incorrect: string;

  // Guide
  guideTitle: string;
  guideDescription: string;
  gettingStarted: string;
  howToTrade: string;
  strategies: string;
  riskManagement: string;
  advancedFeatures: string;
  proTips: string;
  quickReference: string;
  faq: string;
  balance: string;
  pnlLabel: string;
  risk: string;
  isRealMoney: string;
  resetBalance: string;
  howToUseLeverage: string;
  whatIsStopLoss: string;
  howToTrackPerformance: string;

  // Challenges
  challengesTitle: string;
  startChallenge: string;
  xp: string;

  // News
  marketNews: string;
  marketNewsDescription: string;
  allEvents: string;
  bullish: string;
  bearish: string;
  neutral: string;
  importantNotice: string;
  noticeDescription: string;
}

const en: Translations = {
  dashboard: 'Dashboard',
  markets: 'Markets',
  trade: 'Trade',
  portfolio: 'Portfolio',
  history: 'History',
  watchlist: 'Watchlist',
  news: 'News',
  learn: 'Learn',
  guide: 'Guide',
  challenges: 'Challenges',
  settings: 'Settings',
  simulated: 'SIMULATED',
  disclaimer: 'This platform is an educational trading simulator. Prices, trades and market events are simulated and do not represent real financial markets.',
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  add: 'Add',
  remove: 'Remove',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  portfolioValue: 'Portfolio Value',
  availableBalance: 'Available USDT',
  totalPnl: 'Total PnL',
  todayPnl: "Today's PnL",
  marketCap: 'Market Cap',
  volume24h: '24h Volume',
  btcDominance: 'BTC Dominance',
  openPositions: 'Open Positions',
  welcomeBack: 'Welcome back. Here\'s your portfolio overview.',
  searchCoins: 'Search coins...',
  noPositions: 'No open positions.',
  noTrades: 'No trades yet.',
  noWatchlist: 'No coins in watchlist.',
  allocation: 'Portfolio Allocation',
  marketOverview: 'Market Overview',
  recentTrades: 'Recent Trades',
  watchlistTitle: 'Watchlist',
  tradingTerminal: 'Trading Terminal',
  buy: 'Buy',
  sell: 'Sell',
  market: 'Market',
  limit: 'Limit',
  stopLoss: 'Stop Loss',
  takeProfit: 'Take Profit',
  price: 'Price',
  quantity: 'Quantity',
  leverage: 'Leverage',
  estimatedCost: 'Estimated Cost',
  fees: 'Fees',
  available: 'Available',
  potentialProfit: 'Potential Profit',
  potentialLoss: 'Potential Loss',
  riskReward: 'Risk/Reward',
  placeOrder: 'Place Order',
  orderSummary: 'Order Summary',
  stopLossOptional: 'Stop Loss (optional)',
  takeProfitOptional: 'Take Profit (optional)',
  indicators: 'Indicators',
  openOrders: 'Open Orders',
  tradeHistory: 'Trade History',
  asset: 'Asset',
  side: 'Side',
  type: 'Type',
  entry: 'Entry',
  exit: 'Exit',
  pnl: 'PnL',
  pnlPct: 'PnL %',
  action: 'Action',
  closePosition: 'Close',
  totalBalance: 'Total Balance',
  unrealizedPnl: 'Unrealized PnL',
  winRate: 'Win Rate',
  riskRewardLabel: 'Risk/Reward',
  totalTrades: 'Total Trades',
  realizedPnl: 'Realized PnL',
  avgProfit: 'Avg Profit',
  avgLoss: 'Avg Loss',
  assetAllocation: 'Asset Allocation',
  tradePerformance: 'Trade Performance',
  holdings: 'Holdings',
  noHoldings: 'No holdings yet.',
  entryPrice: 'Entry Price',
  current: 'Current',
  value: 'Value',
  tradeHistoryTitle: 'Trade History',
  date: 'Date',
  assetLabel: 'Asset',
  noTradesFound: 'No trades found.',
  trackCoins: 'Track your favorite cryptocurrencies.',
  addToWatchlist: 'Add to Watchlist',
  high: 'High',
  low: 'Low',
  volume: 'Volume',
  settingsTitle: 'Settings',
  appearance: 'Appearance',
  trading: 'Trading',
  notifications: 'Notifications',
  account: 'Account',
  darkMode: 'Dark Mode',
  currencyDisplay: 'Currency Display',
  simulationSpeed: 'Simulation Speed',
  enableNotifications: 'Enable Notifications',
  currentBalance: 'Current Balance',
  startingBalance: 'Starting Balance (on reset)',
  dangerZone: 'Danger Zone',
  resetDemoAccount: 'Reset Demo Account',
  resetDescription: 'This will reset your demo account. All trades, positions, and progress will be lost.',
  confirmReset: 'Confirm Reset',
  resetWarning: 'Are you sure? This cannot be undone.',
  learnTitle: 'Learn',
  all: 'All',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expand: 'Expand',
  completed: 'Completed',
  markAsComplete: 'Mark as Complete',
  quiz: 'Quiz',
  correct: 'Correct!',
  incorrect: 'Incorrect',
  guideTitle: 'Trading Guide',
  guideDescription: 'Learn how to trade effectively on Crypta.',
  gettingStarted: 'Getting Started',
  howToTrade: 'How to Trade',
  strategies: 'Trading Strategies',
  riskManagement: 'Risk Management',
  advancedFeatures: 'Advanced Features',
  proTips: 'Pro Tips',
  quickReference: 'Quick Reference',
  faq: 'Frequently Asked Questions',
  balance: 'Balance',
  pnlLabel: 'PnL',
  risk: 'Risk',
  isRealMoney: 'Is this real money?',
  resetBalance: 'Can I reset my balance?',
  howToUseLeverage: 'How do I use leverage?',
  whatIsStopLoss: 'What is a stop loss?',
  howToTrackPerformance: 'How do I track my performance?',
  challengesTitle: 'Challenges',
  startChallenge: 'Start Challenge',
  xp: 'XP',
  marketNews: 'Market News',
  marketNewsDescription: 'Simulated market events and educational insights.',
  allEvents: 'All Events',
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
  importantNotice: 'Important Notice',
  noticeDescription: 'All news events are simulated for educational purposes only.',
};

const ru: Translations = {
  dashboard: 'Дашборд',
  markets: 'Рынки',
  trade: 'Торговля',
  portfolio: 'Портфель',
  history: 'История',
  watchlist: 'Список наблюдения',
  news: 'Новости',
  learn: 'Учеба',
  guide: 'Гайд',
  challenges: 'Челленджи',
  settings: 'Настройки',
  simulated: 'СИМУЛЯЦИЯ',
  disclaimer: 'Эта платформа является образовательным торговым симулятором. Цены, сделки и рыночные события симулируются.',
  close: 'Закрыть',
  cancel: 'Отмена',
  confirm: 'Подтвердить',
  delete: 'Удалить',
  add: 'Добавить',
  remove: 'Удалить',
  search: 'Поиск',
  filter: 'Фильтр',
  sort: 'Сортировка',
  portfolioValue: 'Стоимость портфеля',
  availableBalance: 'Доступный USDT',
  totalPnl: 'Общий PnL',
  todayPnl: 'PnL за сегодня',
  marketCap: 'Рыночная капитализация',
  volume24h: 'Объём 24ч',
  btcDominance: 'Доминирование BTC',
  openPositions: 'Открытые позиции',
  welcomeBack: 'С возвращением. Вот обзор вашего портфеля.',
  searchCoins: 'Поиск монет...',
  noPositions: 'Нет открытых позиций.',
  noTrades: 'Нет сделок.',
  noWatchlist: 'Нет монет в списке наблюдения.',
  allocation: 'Распределение портфеля',
  marketOverview: 'Обзор рынка',
  recentTrades: 'Последние сделки',
  watchlistTitle: 'Список наблюдения',
  tradingTerminal: 'Торговый терминал',
  buy: 'Купить',
  sell: 'Продать',
  market: 'Рыночная',
  limit: 'Лимитная',
  stopLoss: 'Стоп-лосс',
  takeProfit: 'Тейк-профит',
  price: 'Цена',
  quantity: 'Количество',
  leverage: 'Кредитное плечо',
  estimatedCost: 'Оценочная стоимость',
  fees: 'Комиссии',
  available: 'Доступно',
  potentialProfit: 'Потенциальная прибыль',
  potentialLoss: 'Потенциальный убыток',
  riskReward: 'Риск/Прибыль',
  placeOrder: 'Разместить ордер',
  orderSummary: 'Итог ордера',
  stopLossOptional: 'Стоп-лосс (опционально)',
  takeProfitOptional: 'Тейк-профит (опционально)',
  indicators: 'Индикаторы',
  openOrders: 'Открытые ордера',
  tradeHistory: 'История сделок',
  asset: 'Актив',
  side: 'Сторона',
  type: 'Тип',
  entry: 'Вход',
  exit: 'Выход',
  pnl: 'PnL',
  pnlPct: 'PnL %',
  action: 'Действие',
  closePosition: 'Закрыть',
  totalBalance: 'Общий баланс',
  unrealizedPnl: 'Нереализованный PnL',
  winRate: 'Процент выигрышей',
  riskRewardLabel: 'Риск/Прибыль',
  totalTrades: 'Всего сделок',
  realizedPnl: 'Реализованный PnL',
  avgProfit: 'Ср. прибыль',
  avgLoss: 'Ср. убыток',
  assetAllocation: 'Распределение активов',
  tradePerformance: 'Производительность сделок',
  holdings: 'Активы',
  noHoldings: 'Нет активов.',
  entryPrice: 'Цена входа',
  current: 'Текущая',
  value: 'Стоимость',
  tradeHistoryTitle: 'История сделок',
  date: 'Дата',
  assetLabel: 'Актив',
  noTradesFound: 'Сделки не найдены.',
  trackCoins: 'Отслеживайте любимые криптовалюты.',
  addToWatchlist: 'Добавить в список наблюдения',
  high: 'Макс',
  low: 'Мин',
  volume: 'Объём',
  settingsTitle: 'Настройки',
  appearance: 'Внешний вид',
  trading: 'Торговля',
  notifications: 'Уведомления',
  account: 'Аккаунт',
  darkMode: 'Тёмный режим',
  currencyDisplay: 'Отображение валюты',
  simulationSpeed: 'Скорость симуляции',
  enableNotifications: 'Включить уведомления',
  currentBalance: 'Текущий баланс',
  startingBalance: 'Начальный баланс (при сбросе)',
  dangerZone: 'Зона опасности',
  resetDemoAccount: 'Сбросить демо-аккаунт',
  resetDescription: 'Это сбросит ваш демо-аккаунт. Все сделки, позиции и прогресс будут потеряны.',
  confirmReset: 'Подтвердить сброс',
  resetWarning: 'Вы уверены? Это нельзя отменить.',
  learnTitle: 'Учеба',
  all: 'Все',
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  expand: 'Развернуть',
  completed: 'Пройдено',
  markAsComplete: 'Отметить как пройденный',
  quiz: 'Квиз',
  correct: 'Верно!',
  incorrect: 'Неверно',
  guideTitle: 'Торговский гайд',
  guideDescription: 'Узнайте, как эффективно торговать на Crypta.',
  gettingStarted: 'Начало работы',
  howToTrade: 'Как торговать',
  strategies: 'Торговые стратегии',
  riskManagement: 'Управление рисками',
  advancedFeatures: 'Расширенные функции',
  proTips: 'Профессиональные советы',
  quickReference: 'Шпаргалка',
  faq: 'Часто задаваемые вопросы',
  balance: 'Баланс',
  pnlLabel: 'PnL',
  risk: 'Риск',
  isRealMoney: 'Это реальные деньги?',
  resetBalance: 'Могу ли я сбросить свой баланс?',
  howToUseLeverage: 'Как использовать кредитное плечо?',
  whatIsStopLoss: 'Что такое стоп-лосс?',
  howToTrackPerformance: 'Как отслеживать свою производительность?',
  challengesTitle: 'Челленджи',
  startChallenge: 'Начать челлендж',
  xp: 'Опыт',
  marketNews: 'Рыночные новости',
  marketNewsDescription: 'Симулированные рыночные события и образовательные инсайты.',
  allEvents: 'Все события',
  bullish: 'Бычий',
  bearish: 'Медвежий',
  neutral: 'Нейтральный',
  importantNotice: 'Важное уведомление',
  noticeDescription: 'Все новостные события симулируются в образовательных целях.',
};

export { en, ru };
export type { Translations };
