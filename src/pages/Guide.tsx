import { useState } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import {
  Rocket, BookOpen, ChevronDown, ChevronRight, Check, Lightbulb,
  ArrowRightLeft, Wallet, TrendingUp, Shield, Zap,
  CircleHelp, ArrowUpRight, ArrowDownRight, Settings,
  Info,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

interface GuideArticle {
  id: string;
  sectionId: string;
  title: string;
  content: string;
  tips: string[];
}

const sections: GuideSection[] = [
  { id: 'getting-started', title: 'Getting Started', icon: Rocket, description: 'Learn the basics of the Crypta simulator' },
  { id: 'how-to-trade', title: 'How to Trade', icon: ArrowRightLeft, description: 'Master the trading interface and order types' },
  { id: 'strategies', title: 'Trading Strategies', icon: TrendingUp, description: 'Develop profitable trading approaches' },
  { id: 'risk-management', title: 'Risk Management', icon: Shield, description: 'Protect your portfolio with smart risk controls' },
  { id: 'advanced', title: 'Advanced Features', icon: Zap, description: 'Leverage, stop losses, and take profits' },
  { id: 'tips', title: 'Pro Tips', icon: Lightbulb, description: 'Insider knowledge from experienced traders' },
];

const articles: GuideArticle[] = [
  {
    id: 'gs-1',
    sectionId: 'getting-started',
    title: 'Welcome to Crypta',
    content: 'Crypta is a cryptocurrency trading simulator that lets you practice trading with virtual money. You start with a demo balance of $10,000 USDT and can trade any of the available cryptocurrencies. All prices are simulated and reflect real market conditions.',
    tips: ['Start with small positions to learn the interface', 'Use the watchlist to track your favorite coins', 'Check the News page for simulated market events'],
  },
  {
    id: 'gs-2',
    sectionId: 'getting-started',
    title: 'Understanding the Interface',
    content: 'The main interface consists of a sidebar navigation, a top bar with your balance and search, and the main content area. Use the sidebar to navigate between pages. The top bar shows your current balance and allows you to search for coins.',
    tips: ['Collapse the sidebar for more screen space', 'Use the search bar to quickly find coins', 'The SIMULATION label reminds you this is not real money'],
  },
  {
    id: 'ht-1',
    sectionId: 'how-to-trade',
    title: 'Placing Your First Trade',
    content: 'To place a trade, go to the Trade page. Select a coin from the left panel, choose Buy or Sell, select an order type, enter the quantity, and click the place order button. The order summary panel shows estimated costs, fees, and potential profit/loss.',
    tips: ['Start with market orders for simplicity', 'Check the order summary before confirming', 'Use small quantities until you are comfortable'],
  },
  {
    id: 'ht-2',
    sectionId: 'how-to-trade',
    title: 'Order Types Explained',
    content: 'Market orders execute immediately at the current price. Limit orders execute only when the price reaches your specified level. Stop Loss orders automatically sell when the price drops to a certain level, limiting your losses. Take Profit orders automatically sell when the price reaches your target profit level.',
    tips: ['Market orders are best for quick trades', 'Limit orders give you more control over entry price', 'Always use Stop Loss to protect against large losses'],
  },
  {
    id: 'st-1',
    sectionId: 'strategies',
    title: 'Dollar Cost Averaging',
    content: 'Dollar Cost Averaging (DCA) involves buying a fixed amount of a cryptocurrency at regular intervals, regardless of price. This reduces the impact of volatility and avoids the risk of buying at a peak. In Crypta, you can practice DCA by placing small buy orders at regular intervals.',
    tips: ['Set a fixed amount and schedule', 'Be consistent with your DCA intervals', 'DCA works best over longer time periods'],
  },
  {
    id: 'st-2',
    sectionId: 'strategies',
    title: 'Trend Following',
    content: 'Trend following involves buying when the market is trending up and selling when it is trending down. Use the chart indicators (SMA, EMA) to identify trends. When the price is above the moving average, it is generally in an uptrend. When below, it is in a downtrend.',
    tips: ['Use multiple timeframes to confirm trends', 'Combine SMA and EMA for stronger signals', 'Be patient and wait for clear trend signals'],
  },
  {
    id: 'rm-1',
    sectionId: 'risk-management',
    title: 'Position Sizing',
    content: 'Position sizing determines how much of your portfolio to allocate to each trade. A common rule is to risk no more than 1-2% of your total balance on a single trade. This means if your balance is $10,000, you should not risk more than $100-200 on any single trade.',
    tips: ['Calculate your risk before entering a trade', 'Use the order summary to check potential loss', 'Adjust position size based on your stop loss level'],
  },
  {
    id: 'rm-2',
    sectionId: 'risk-management',
    title: 'Using Stop Losses',
    content: 'Stop losses are essential for risk management. They automatically close your position when the price drops to a predetermined level, limiting your losses. Always set a stop loss before entering a trade. The stop loss percentage should be based on your risk tolerance and the volatility of the coin.',
    tips: ['Set stop losses immediately after entering a trade', 'Adjust stop losses as the trade moves in your favor', 'Never move your stop loss further away from entry'],
  },
  {
    id: 'adv-1',
    sectionId: 'advanced',
    title: 'Leverage Trading',
    content: 'Leverage allows you to multiply your trading position by borrowing funds. For example, 5x leverage means a $100 position controls $500 worth of cryptocurrency. While leverage amplifies profits, it also amplifies losses. Use leverage carefully and always set stop losses.',
    tips: ['Start with low leverage (2-3x)', 'Never use maximum leverage', 'Always use stop losses with leverage'],
  },
  {
    id: 'adv-2',
    sectionId: 'advanced',
    title: 'Take Profit Orders',
    content: 'Take profit orders automatically close your position when the price reaches your target profit level. This locks in profits without needing to monitor the market constantly. Set take profit levels based on your risk/reward ratio and market conditions.',
    tips: ['Set take profit at a level where you would be satisfied with the profit', 'Use a risk/reward ratio of at least 1:2', 'Consider partial take profits at multiple levels'],
  },
  {
    id: 'tp-1',
    sectionId: 'tips',
    title: 'Top Trading Tips',
    content: 'Here are the most important tips for successful trading on Crypta: Always start with a demo account to practice. Never risk more than you can afford to lose. Use stop losses on every trade. Diversify your portfolio across multiple coins. Keep a trading journal to track your performance. Learn from your mistakes and continuously improve your strategy.',
    tips: ['Practice with the demo account first', 'Keep a trading journal', 'Never chase losses', 'Stay calm and stick to your strategy'],
  },
  {
    id: 'tp-2',
    sectionId: 'tips',
    title: 'Common Mistakes to Avoid',
    content: 'Many traders make common mistakes that can lead to significant losses. Avoid overleveraging, which can wipe out your balance quickly. Avoid trading without a plan or stop loss. Avoid emotional trading decisions based on fear or greed. Avoid putting all your capital into a single trade. Avoid ignoring market news and events.',
    tips: ['Always have a trading plan', 'Use stop losses', 'Avoid emotional decisions', 'Diversify your portfolio'],
  },
];

export function Guide() {
  const { completedLessonCount, lessons } = useStore();
  const totalLessons = lessons.length;
  const progress = totalLessons > 0 ? (completedLessonCount() / totalLessons) * 100 : 0;
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Trading Guide</h1>
          <p className="text-text-secondary text-sm mt-1">Learn how to trade effectively on Crypta. Complete lessons and master the markets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-text-secondary">Progress</div>
            <div className="text-sm font-semibold text-accent">{completedLessonCount()}/{totalLessons} lessons done</div>
          </div>
          <SimulatedLabel />
        </div>
      </div>

      {/* Overall Progress */}
      <Card glow>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-text-secondary">Overall Progress</span>
              <span className="text-text-primary font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-purple rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <Check size={20} />
            <span className="font-semibold">{completedLessonCount()}/{totalLessons}</span>
          </div>
        </div>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const sectionArticles = articles.filter((a) => a.sectionId === section.id);
          const isExpanded = expandedSection === section.id;
          const completedArticles = sectionArticles.filter((a) => expandedArticle === a.id).length;

          return (
            <Card key={section.id} className={`transition-all duration-200 ${isExpanded ? 'glow-accent' : ''}`}>
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full flex items-center gap-4 p-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isExpanded ? 'bg-accent/10 text-accent' : 'bg-bg-hover text-text-secondary'
                }`}>
                  <section.icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-text-primary">{section.title}</div>
                  <div className="text-xs text-text-secondary">{section.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  {sectionArticles.length > 0 && (
                    <span className="text-[10px] bg-bg-hover text-text-secondary px-2 py-0.5 rounded-full font-medium">
                      {sectionArticles.length} article{sectionArticles.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {isExpanded ? <ChevronDown size={18} className="text-text-muted" /> : <ChevronRight size={18} className="text-text-muted" />}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-2 px-4 pb-4 animate-slide-up">
                  {sectionArticles.map((article) => (
                    <div key={article.id} className="border border-border-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-bg-hover transition-colors"
                      >
                        {expandedArticle === article.id ? <ChevronDown size={16} className="text-accent shrink-0" /> : <ChevronRight size={16} className="text-text-muted shrink-0" />}
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-medium ${expandedArticle === article.id ? 'text-accent' : 'text-text-primary'}`}>
                            {article.title}
                          </div>
                        </div>
                        {expandedArticle === article.id && <Info size={14} className="text-accent shrink-0" />}
                      </button>

                      {expandedArticle === article.id && (
                        <div className="px-3 pb-3 space-y-3 animate-slide-up">
                          <p className="text-xs text-text-secondary leading-relaxed">{article.content}</p>
                          {article.tips.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Key Tips</div>
                              {article.tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                                  <Lightbulb size={12} className="text-gold shrink-0 mt-0.5" />
                                  {tip}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Reference */}
      <Card>
        <h3 className="section-title">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-hover rounded-lg p-3 border border-border-light">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-accent" />
              <span className="text-xs font-semibold text-text-primary">Balance</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">Your available USDT for trading. Check the top bar or sidebar for your current balance.</p>
          </div>
          <div className="bg-bg-hover rounded-lg p-3 border border-border-light">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft size={16} className="text-profit" />
              <span className="text-xs font-semibold text-text-primary">PnL</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">Profit and Loss. Green means profit, red means loss. Track your performance in the Portfolio page.</p>
          </div>
          <div className="bg-bg-hover rounded-lg p-3 border border-border-light">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-loss" />
              <span className="text-xs font-semibold text-text-primary">Risk</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">Always use stop losses. Never risk more than 1-2% of your balance on a single trade.</p>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card>
        <h3 className="section-title">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            { q: 'Is this real money?', a: 'No. Crypta is a trading simulator. All prices, trades, and balances are simulated using virtual USDT.' },
            { q: 'Can I reset my balance?', a: 'Yes. Go to Settings and use the Reset Demo Account feature. You can also change the starting balance there.' },
            { q: 'How do I use leverage?', a: 'On the Trade page, select your desired leverage (1x-20x) using the leverage slider. Higher leverage increases both potential profit and loss.' },
            { q: 'What is a stop loss?', a: 'A stop loss automatically closes your position when the price drops to a certain level, limiting your potential losses.' },
            { q: 'How do I track my performance?', a: 'Visit the Portfolio page to see your total balance, unrealized PnL, win rate, and trade history.' },
          ].map((faq, i) => (
            <div key={i} className="bg-bg-hover rounded-lg p-3 border border-border-light">
              <div className="flex items-center gap-2 mb-1">
                <CircleHelp size={14} className="text-accent" />
                <span className="text-xs font-semibold text-text-primary">{faq.q}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed ml-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>

      <Disclaimer />
    </div>
  );
}
