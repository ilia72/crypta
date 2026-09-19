import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Portfolio } from './pages/Portfolio';
import { History } from './pages/History';
import { Watchlist } from './pages/Watchlist';
import { MarketPage } from './pages/MarketPage';
import { Learn } from './pages/Learn';
import { Guide } from './pages/Guide';
import { Challenges } from './pages/Challenges';
import { Settings } from './pages/Settings';
import { News } from './pages/News';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="trade" element={<Trading />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="history" element={<History />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="markets" element={<MarketPage />} />
          <Route path="news" element={<News />} />
          <Route path="learn" element={<Learn />} />
          <Route path="guide" element={<Guide />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
