// 前端直接调用 API，不使用后端 API Routes
import { useState, useEffect } from 'react';

const ITICK_API_KEY = 'f3dd1e8b5bda476ab5e945a672d84768a5f702f82b40418bbf3346d52bc1527a';
const TWELVE_API_KEY = '20fbb5559ad7476fa1ee8e64117a9304';

const STOCKS = [
  { code: 'GOOG', name: 'ALPHABET', market: '美股', src: 'twelve' },
  { code: 'NVDA', name: 'NVIDIA', market: '美股', src: 'twelve' },
  { code: 'TSM', name: 'TSMC-ADR', market: '美股', src: 'twelve' },
  { code: 'META', name: 'META', market: '美股', src: 'twelve' },
  { code: 'AMZN', name: 'AMAZON', market: '美股', src: 'twelve' },
  { code: 'TSLA', name: 'TESLA', market: '美股', src: 'twelve' },
  { code: 'NIO', name: '蔚来', market: '美股', src: 'twelve' },
  { code: 'BABA', name: '阿里巴巴', market: '美股', src: 'twelve' },
  { code: '700', name: '腾讯', market: '港股', region: 'hk', src: 'itick' },
  { code: '3690', name: '美团', market: '港股', region: 'hk', src: 'itick' },
  { code: '9868', name: '小鹏', market: '港股', region: 'hk', src: 'itick' },
  { code: '2015', name: '理想', market: '港股', region: 'hk', src: 'itick' },
  { code: '1211', name: '比亚迪', market: '港股', region: 'hk', src: 'itick' },
  { code: '100', name: 'MINIMAX', market: '港股', region: 'hk', src: 'itick' },
  { code: 'RR.', name: 'Rolls-Royce', market: '欧洲', region: 'gb', src: 'itick' },
  { code: 'AIR', name: 'Airbus', market: '欧洲', region: 'fr', src: 'itick' },
  { code: 'SAF', name: 'Safran', market: '欧洲', region: 'fr', src: 'itick' },
  { code: 'ENR', name: 'Siemens Energy', market: '欧洲', region: 'de', src: 'itick' },
  { code: '688256', name: '寒武纪', market: 'A股', region: 'sh', src: 'itick' },
  { code: '300750', name: '宁德时代', market: 'A股', region: 'sz', src: 'itick' },
  { code: '7203', name: '丰田', market: '日本', region: 'jp', src: 'itick' },
  { code: '6758', name: '索尼', market: '日本', region: 'jp', src: 'itick' },
  { code: '2330', name: '台积电', market: '台湾', region: 'tw', src: 'itick' },
  { code: '2454', name: '联发科', market: '台湾', region: 'tw', src: 'itick' },
  { code: '660', name: 'SK海力士', market: '韩国', region: 'kr', src: 'itick' },
  { code: '5930', name: '三星电子', market: '韩国', region: 'kr', src: 'itick' },
];

const MARKET_HOURS = {
  'A股': { open: '09:30', close: '15:00' },
  '港股': { open: '09:30', close: '16:00' },
  '台湾': { open: '09:00', close: '13:30' },
  '日本': { open: '08:00', close: '14:00' },
  '韩国': { open: '08:00', close: '14:00' },
  '欧洲': { open: '15:00', close: '23:30' },
  '美股': { open: '21:30', close: '04:00', nextDay: true },
};

function isMarketOpen(market) {
  const now = new Date();
  const weekday = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
  const currentTime = now.toTimeString().slice(0, 5);
  const hours = MARKET_HOURS[market];
  
  // 周六(6)和周日(0)休市
  if (weekday === 0 || weekday === 6) return false;
  if (!hours) return true;
  
  const { open, close, nextDay } = hours;
  if (nextDay) {
    // 跨天市场（如美股 21:30-04:00）
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

async function fetchTwelveStock(code) {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${code}&apikey=${TWELVE_API_KEY}`
    );
    const data = await response.json();
    if (data.close) {
      const price = parseFloat(data.close);
      const prevClose = parseFloat(data.previous_close);
      return {
        price, changePct: parseFloat(((price - prevClose) / prevClose * 100).toFixed(2)),
        prevClose, high: parseFloat(data.high), low: parseFloat(data.low), volume: parseInt(data.volume)
      };
    }
  } catch (e) { console.error(`Twelve error for ${code}:`, e); }
  return null;
}

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [closedStocks, setClosedStocks] = useState({}); // 休市股票缓存
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
      
      // 获取开盘市场的数据
      const stocksToFetch = STOCKS.filter(s => openMarkets.includes(s.market));
      const results = [];
      for (const stock of stocksToFetch) {
        let data = null;
        if (stock.src === 'itick') {
          data = await fetchItickStock(stock.region, stock.code);
        } else {
          data = await fetchTwelveStock(stock.code);
        }
        if (data) {
          results.push({ code: stock.code, name: stock.name, market: stock.market, isOpen: true, ...data });
          // 更新缓存
          setClosedStocks(prev => ({ ...prev, [stock.code]: { ...data, name: stock.name, market: stock.market } }));
        }
        await new Promise(r => setTimeout(r, 100));
      }
      
      // 添加休市股票（从缓存）
      const closedResults = STOCKS.filter(s => closedMarkets.includes(s.market) && closedStocks[s.code])
        .map(s => ({ code: s.code, isOpen: false, ...closedStocks[s.code] }));
      
      setStocks([...results, ...closedResults]);
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

  const alerts = stocks.filter(s => Math.abs(s.changePct) >= 3);

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
        {/* 市场状态 */}
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

        {/* 异动提醒 */}
        {alerts.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #151922 100%)', border: '1px solid #2a3142', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>⚠️ 异动提醒 <span style={{ background: '#ef4444', color: '#fff', fontSize: '12px', padding: '2px 8px', borderRadius: '10px' }}>{alerts.length}</span></div>
            {alerts.map(s => (
              <div key={s.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: '#252b3d', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${s.changePct >= 0 ? '#22c55e' : '#ef4444'}` }}>
                <div><strong>{s.name}</strong> <span style={{ color: '#8b92a8' }}>{s.market}</span></div>
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
              <div key={s.code} style={{ 
                background: 'linear-gradient(135deg, #1a1f2e 0%, #151922 100%)', 
                border: '1px solid #2a3142', 
                borderRadius: '12px', 
                padding: '20px', 
                borderLeft: `3px solid ${up ? '#22c55e' : '#ef4444'}`,
                opacity: s.isOpen ? 1 : 0.7
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{s.name}</h3>
                    <div style={{ fontSize: '12px', color: '#8b92a8' }}>{s.code}</div>
                  </div>
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

        <div style={{ textAlign: 'center', padding: '20px', color: '#5a6275', fontSize: '13px' }}>只刷新开盘市场 | 每分钟更新 | 阈值: ±3%</div>
      </div>

      <style jsx global>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
