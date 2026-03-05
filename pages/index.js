// 前端直接调用 API，不使用后端 API Routes
import { useState, useEffect } from 'react';

const ITICK_API_KEY = 'f3dd1e8b5bda476ab5e945a672d84768a5f702f82b40418bbf3346d52bc1527a';

const STOCKS = [
  { code: '100', name: 'MINIMAX', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk100/nc.shtml' },
  { code: '2330', name: '台积电', market: '台湾', region: 'tw', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/2330.TW/news' },
  { code: '981', name: '中芯国际-H', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk981/nc.shtml' },
  { code: 'GOOG', name: 'ALPHABET', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/GOOG/news' },
  { code: '688256', name: '寒武纪', market: 'A股', region: 'sh', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/sh688256/nc.shtml' },
  { code: 'NVDA', name: 'NVIDIA', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/NVDA/news' },
  { code: 'TSM', name: 'TSMC-ADR', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/TSM/news' },
  { code: '2513', name: '知识图谱-H', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2513/nc.shtml' },
  { code: 'META', name: 'META', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/META/news' },
  { code: '1347', name: '华虹半导体-H', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk1347/nc.shtml' },
  { code: 'AMZN', name: 'AMAZON', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/AMZN/news' },
  { code: 'SOXX', name: 'SEMI ETF', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SOXX/news' },
  { code: 'YMM', name: '满帮', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/YMM/news' },
  { code: 'SE', name: 'Sea Ltd', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SE/news' },
  { code: '2259', name: '紫金矿业', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2259/nc.shtml' },
  { code: 'SFTBY', name: '软银-ADR', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SFTBY/news' },
  { code: 'ARM', name: 'ARM', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/ARM/news' },
  { code: '9984', name: '软银', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/9984.T/news' },
  { code: 'SNDK', name: 'SanDisk', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SNDK/news' },
  { code: 'MU', name: '美光', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/MU/news' },
  { code: '660', name: 'SK海力士', market: '韩国', region: 'kr', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/660.KS/news' },
  { code: '5930', name: '三星电子', market: '韩国', region: 'kr', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/5930.KS/news' },
  { code: 'SNPS', name: 'Synopsys', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SNPS/news' },
  { code: 'ADBE', name: 'Adobe', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/ADBE/news' },
  { code: 'CDNS', name: 'Cadence', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/CDNS/news' },
  { code: 'TME', name: '腾讯音乐', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/TME/news' },
  { code: '700', name: '腾讯', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk700/nc.shtml' },
  { code: 'TCOM', name: '携程', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/TCOM/news' },
  { code: 'BABA', name: '阿里巴巴', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/BABA/news' },
  { code: '3690', name: '美团', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk3690/nc.shtml' },
  { code: '9690', name: '途虎', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9690/nc.shtml' },
  { code: '9899', name: '网易云音乐', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9899/nc.shtml' },
  { code: 'DIDIY', name: '滴滴', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/DIDIY/news' },
  { code: '9888', name: '百度-SW', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9888/nc.shtml' },
  { code: 'BIDU', name: '百度', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/BIDU/news' },
  { code: '1698', name: '腾讯音乐', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk1698/nc.shtml' },
  { code: '9961', name: '携程', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9961/nc.shtml' },
  { code: '9988', name: '阿里-W', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9988/nc.shtml' },
  { code: 'PDD', name: '拼多多', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/PDD/news' },
  { code: 'NFLX', name: '奈飞', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/NFLX/news' },
  { code: 'SPOT', name: 'Spotify', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/SPOT/news' },
  { code: '338', name: '潍柴动力', market: 'A股', region: 'sz', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/338/nc.shtml' },
  { code: '2338', name: '潍柴动力-H', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2338/nc.shtml' },
  { code: '3750', name: '宁德时代-H', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk3750/nc.shtml' },
  { code: '300750', name: '宁德时代', market: 'A股', region: 'sz', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/300750/nc.shtml' },
  { code: '603308', name: '安徽应流', market: 'A股', region: 'sh', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/603308/nc.shtml' },
  { code: 'CCJ', name: 'Cameco', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/CCJ/news' },
  { code: '2028', name: '思源电气', market: 'A股', region: 'sh', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/2028/nc.shtml' },
  { code: 'ENR', name: 'Siemens Energy', market: '欧洲', region: 'de', src: 'itick', newsUrl: 'https://www.bloomberg.com/quote/ENR' },
  { code: '600066', name: '宇通客车', market: 'A股', region: 'sh', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/600066/nc.shtml' },
  { code: '2525', name: '禾赛集团', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2525/nc.shtml' },
  { code: 'TSLA', name: '特斯拉', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/TSLA/news' },
  { code: '000957', name: '中通客车', market: 'A股', region: 'sz', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/000957/nc.shtml' },
  { code: 'HSAI', name: '禾赛', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/HSAI/news' },
  { code: 'NIO', name: '蔚来', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/NIO/news' },
  { code: '2498', name: '速腾聚创', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2498/nc.shtml' },
  { code: '9868', name: '小鹏', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9868/nc.shtml' },
  { code: '2015', name: '理想', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk2015/nc.shtml' },
  { code: '1211', name: '比亚迪', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk1211/nc.shtml' },
  { code: '9866', name: '蔚来', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9866/nc.shtml' },
  { code: '5714', name: 'Dowa', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/5714.T/news' },
  { code: 'LYC', name: 'Lynas', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/LYC/news' },
  { code: '2768', name: '双日', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/2768.T/news' },
  { code: '6269', name: 'Modec', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/6269.T/news' },
  { code: '6981', name: '村田', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/6981.T/news' },
  { code: '6902', name: '电装', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/6902.T/news' },
  { code: '6594', name: '日本电产', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/6594.T/news' },
  { code: '7011', name: '三菱重工', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/7011.T/news' },
  { code: '7013', name: 'IHI', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/7013.T/news' },
  { code: '7012', name: '川崎重工', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/7012.T/news' },
  { code: '4062', name: 'IBIDEN', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/4062.T/news' },
  { code: 'LKNCY', name: '瑞幸', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/LKNCY/news' },
  { code: '1364', name: '古茗', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk1364/nc.shtml' },
  { code: '1086', name: '好孩子', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk1086/nc.shtml' },
  { code: '9992', name: '泡泡玛特', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9992/nc.shtml' },
  { code: 'EDU', name: '新东方', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/EDU/news' },
  { code: 'TAL', name: '好未来', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/TAL/news' },
  { code: '9896', name: '名创优品', market: '港股', region: 'hk', src: 'itick', newsUrl: 'https://finance.sina.com.cn/realstock/company/hk9896/nc.shtml' },
  { code: 'MNSO', name: '名创优品-ADR', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/MNSO/news' },
  { code: 'RR.', name: 'Rolls-Royce', market: '欧洲', region: 'gb', src: 'itick', newsUrl: 'https://www.bloomberg.com/quote/RR.' },
  { code: 'AIR', name: 'Airbus', market: '欧洲', region: 'fr', src: 'itick', newsUrl: 'https://www.bloomberg.com/quote/AIR' },
  { code: 'SAF', name: 'Safran', market: '欧洲', region: 'fr', src: 'itick', newsUrl: 'https://www.bloomberg.com/quote/SAF' },
  { code: 'HWM', name: 'Howmet', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/HWM/news' },
  { code: 'FTAI', name: 'FTAI Aviation', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/FTAI/news' },
  { code: 'AIRP', name: 'Air Products', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/AIRP/news' },
  { code: 'LIN', name: 'Linde', market: '美股', region: 'us', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/LIN/news' },
  { code: '7203', name: '丰田', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/7203.T/news' },
  { code: '6758', name: '索尼', market: '日本', region: 'jp', src: 'itick', newsUrl: 'https://finance.yahoo.com/quote/6758.T/news' },
];

const MARKET_HOURS = {
  'A股': { open: '09:30', close: '15:00', lunchStart: '11:30', lunchEnd: '13:00' },
  '港股': { open: '09:30', close: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
  '台湾': { open: '09:00', close: '13:30' },
  '日本': { open: '08:00', close: '14:00', lunchStart: '11:30', lunchEnd: '12:30' },
  '韩国': { open: '08:00', close: '14:00' },
  '欧洲': { open: '15:00', close: '23:30' },
  '美股': { open: '21:30', close: '04:00', nextDay: true },
};

function isMarketOpen(market) {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const beijingTime = new Date(utc + (3600000 * 8));
  const weekday = beijingTime.getDay();
  const currentTime = beijingTime.toTimeString().slice(0, 5);
  const hours = MARKET_HOURS[market];
  
  if (weekday === 0 || weekday === 6) return false;
  if (!hours) return true;
  
  const { open, close, nextDay } = hours;
  if (nextDay) {
    return currentTime >= open || currentTime <= close;
  }
  return currentTime >= open && currentTime <= close;
}

async function fetchItickStock(region, code) {
  try {
    const response = await fetch(
      `https://api.itick.org/stock/quote?region=${region}&code=${code}`,
      { headers: { 'accept': 'application/json', 'token': ITICK_API_KEY } }
    );
    const data = await response.json();
    if (data.code === 0 && data.data) {
      const d = data.data;
      return { price: d.p, changePct: d.chp, prevClose: d.ld, high: d.h, low: d.l, volume: d.v };
    }
  } catch (e) { console.error(`iTick error for ${code}:`, e); }
  return null;
}

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [closedStocks, setClosedStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const openMarkets = Object.keys(MARKET_HOURS).filter(isMarketOpen);
      const closedMarkets = Object.keys(MARKET_HOURS).filter(m => !isMarketOpen(m));
      
      const stocksToFetch = STOCKS.filter(s => openMarkets.includes(s.market));
      const results = [];
      
      for (const stock of stocksToFetch) {
        let data = null;
        try {
          data = await fetchItickStock(stock.region, stock.code);
        } catch (e) {
          console.error(`Failed to fetch ${stock.code}:`, e);
        }
        
        if (data) {
          results.push({ code: stock.code, name: stock.name, market: stock.market, isOpen: true, newsUrl: stock.newsUrl, ...data });
          setClosedStocks(prev => ({ ...prev, [stock.code]: { ...data, name: stock.name, market: stock.market, newsUrl: stock.newsUrl } }));
        }
        await new Promise(r => setTimeout(r, 200));
      }
      
      const closedResults = STOCKS.filter(s => closedMarkets.includes(s.market) && closedStocks[s.code])
        .map(s => ({ code: s.code, isOpen: false, ...closedStocks[s.code] }));
      
      const allStocks = [...results, ...closedResults];
      allStocks.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
      
      setStocks(allStocks);
      setLastUpdate(new Date());
      setCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    const countdownInterval = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 60), 1000);
    return () => { clearInterval(interval); clearInterval(countdownInterval); };
  }, []);

  const bigAlerts = stocks.filter(s => Math.abs(s.changePct) >= 3);
  const smallAlerts = stocks.filter(s => Math.abs(s.changePct) > 0 && Math.abs(s.changePct) < 3);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)', padding: '20px 30px', borderBottom: '1px solid #2a3142', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', background: 'linear-gradient(90deg, #00d4ff, #7b2cbf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 全球股票实时监控</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', color: '#8b92a8' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
          <span>{loading ? '更新中...' : '已连接'}</span>
          {lastUpdate && <span>{lastUpdate.toLocaleTimeString('zh-CN')}</span>}
          <span style={{ fontSize: '12px', color: '#5a6275' }}>下次: {Math.floor(countdown/60)}:{(countdown%60).toString().padStart(2,'0')}</span>
        </div>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {Object.keys(MARKET_HOURS).map(m => {
            const open = isMarketOpen(m);
            return (
              <div key={m} style={{ padding: '8px 16px', background: open ? 'rgba(34,197,94,0.1)' : '#1a1f2e', border: `1px solid ${open ? '#22c55e' : '#2a3142'}`, borderRadius: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', opacity: open ? 1 : 0.5 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: open ? '#22c55e' : '#5a6275' }}></span>
                <span>{m} {open ? '开盘' : '休市'}</span>
              </div>
            );
          })}
        </div>

        {bigAlerts.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #151922 100%)', border: '1px solid #2a3142', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
              🔴 大幅异动 (≥3%) <span style={{ background: '#ef4444', color: '#fff', fontSize: '12px', padding: '2px 8px', borderRadius: '10px' }}>{bigAlerts.length}</span>
            </div>
            {bigAlerts.map(s => (
              <div key={s.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#252b3d', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${s.changePct >= 0 ? '#22c55e' : '#ef4444'}` }}>
                <div>
                  <div><strong>{s.name}</strong> <span style={{ color: '#8b92a8' }}>{s.market}</span></div>
                  <a href={s.newsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#00d4ff', textDecoration: 'none' }}>📰 相关新闻 →</a>
                </div>
                <div style={{ color: s.changePct >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{s.changePct >= 0 ? '+' : ''}{s.changePct}%</div>
              </div>
            ))}
          </div>
        )}

        {smallAlerts.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #151922 100%)', border: '1px solid #2a3142', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
              🟡 小幅波动 (<3%) <span style={{ background: '#5a6275', color: '#fff', fontSize: '12px', padding: '2px 8px', borderRadius: '10px' }}>{smallAlerts.length}</span>
            </div>
            {smallAlerts.map(s => (
              <div key={s.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#252b3d', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${s.changePct >= 0 ? '#22c55e' : '#ef4444'}` }}>
                <div>
                  <div><strong>{s.name}</strong> <span style={{ color: '#8b92a8' }}>{s.market}</span></div>
                  <a href={s.newsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#00d4ff', textDecoration: 'none' }}>📰 相关新闻 →</a>
                </div>
                <div style={{ color: s.changePct >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{s.changePct >= 0 ? '+' : ''}{s.changePct}%</div>
              </div>
            ))}
          </div>
        )}

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '15px', marginBottom: '20px', color: '#ef4444', textAlign: 'center' }}>错误: {error}</div>}

        {loading && stocks.length === 0 && <div style={{ textAlign: 'center', padding: '50px', color: '#8b92a8' }}><div style={{ width: '50px', height: '50px', border: '3px solid #2a3142', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div><p>正在加载...</p></div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {stocks.map(s => {
            const up = s.changePct >= 0;
            return (
              <div key={s.code} style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #151922 100%)', border: '1px solid #2a3142', borderRadius: '12px', padding: '20px', borderLeft: `3px solid ${up ? '#22c55e' : '#ef4444'}`, opacity: s.isOpen ? 1 : 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div><h3 style={{ fontSize: '16px', fontWeight: 600 }}>{s.name}</h3><div style={{ fontSize: '12px', color: '#8b92a8' }}>{s.code}</div></div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {!s.isOpen && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#5a6275', borderRadius: '4px', color: '#fff' }}>休市</span>}
                    <span style={{ fontSize: '11px', padding: '4px 8px', background: '#252b3d', borderRadius: '4px', color: '#8b92a8' }}>{s.market}</span>
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{s.price}</div>
                <div style={{ color: up ? '#22c55e' : '#ef4444', fontSize: '14px' }}>{up ? '▲' : '▼'} {Math.abs(s.changePct)}%</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2a3142' }}>
                  {[{l:'最高',v:s.high},{l:'最低',v:s.low},{l:'昨收',v:s.prevClose}].map(i=>(
                    <div key={i.l} style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#8b92a8' }}>{i.l}</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{i.v}</div></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {stocks.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '50px', color: '#5a6275' }}>当前无开盘市场</div>}

        <div style={{ textAlign: 'center', padding: '20px', color: '#5a6275', fontSize: '13px' }}>
          监控 {STOCKS.length} 只股票 | 只刷新开盘市场 | 每分钟更新 | 按涨跌幅排序
        </div>
      </div>

      <style jsx global>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
