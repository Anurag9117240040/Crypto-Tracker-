const form = document.querySelector('#searchForm');
const res = document.querySelector('#resTable');

// Update both price table and chart on submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ctype = form.elements.coinType.value;
    fetchPrice(ctype);
});

const fetchPrice = async (ctype) => {
    try {
        // CoinGecko API endpoint for a single coin
        const r = await axios.get(`https://api.coingecko.com/api/v3/coins/${ctype}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        showPrice(r.data);
    } catch (err) {
        console.error('API fetch error:', err);
        if (err.response && err.response.status === 404) {
            res.innerHTML = `<tr><td colspan=\"2\" style=\"color:red;\">Coin not found. Please select a valid coin.</td></tr>`;
        } else {
            res.innerHTML = `<tr><td colspan=\"2\" style=\"color:red;\">Failed to fetch data. Please check your internet connection or try again later.</td></tr>`;
        }
    }
};

// CoinGecko logo URLs for top 20 coins
const coinLogoMap = {
  bitcoin: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ethereum: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  tether: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  binancecoin: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
  solana: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  'usd-coin': 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  ripple: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  dogecoin: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
  toncoin: 'https://assets.coingecko.com/coins/images/17980/large/toncoin.png',
  cardano: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  'shiba-inu': 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
  'avalanche-2': 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
  tron: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  polkadot: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  chainlink: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  polygon: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png',
  litecoin: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
  'internet-computer': 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
  dai: 'https://assets.coingecko.com/coins/images/9956/large/4943.png',
  uniswap: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
};

// Enhance dropdown: add coin logos
function enhanceDropdownWithLogos() {
  const select = document.getElementById('coin');
  if (!select) return;
  // Only run if not already enhanced
  if (select.classList.contains('logos-enhanced')) return;
  select.classList.add('logos-enhanced');
  // Replace options with HTML including logos
  for (let i = 0; i < select.options.length; i++) {
    const opt = select.options[i];
    const logo = coinLogoMap[opt.value];
    if (logo) {
      opt.innerHTML = ` <img src='${logo}' class='coin-logo' style='width:22px;height:22px;vertical-align:middle;margin-right:6px;'>${opt.text}`;
    }
  }
}

const showPrice = (coinData) => {
    const market = coinData.market_data;
    const price = market.current_price.usd;
    const vol = market.total_volume.usd;
    const change = market.price_change_percentage_24h;
    const coin = coinData.name;
    const curr = 'USD';
    const marketCap = market.market_cap.usd;
    const high24h = market.high_24h.usd;
    const low24h = market.low_24h.usd;
    const lastUpdated = new Date(coinData.last_updated).toLocaleString();
    let col = "green";
    if (change < 0) {
        col = "red";
    }
    // Coin logo
    const logo = coinLogoMap[coinData.id] ? `<img src='${coinLogoMap[coinData.id]}' class='coin-logo floating' style='width:36px;height:36px;'>` : '';
    res.innerHTML = `
    <tr class="bg-primary" style="color: white;">
        <td>Property</td>
        <td>Value</td>
    </tr>
    <tr>
        <td>Logo</td>
        <td>${logo}</td>
    </tr>
    <tr>
        <td>Name</td>
        <td>${coin}</td>
    </tr>
    <tr>
        <td>Price</td>
        <td style="color:${col};"><span style="font-size: 1.3em;">${price.toLocaleString(undefined, {maximumFractionDigits: 8})}</span> ${curr}</td>
    </tr>
    <tr>
        <td>Market Cap</td>
        <td>${marketCap.toLocaleString(undefined, {maximumFractionDigits: 0})} ${curr}</td>
    </tr>
    <tr>
        <td>Volume (24hrs)</td>
        <td>${vol.toLocaleString(undefined, {maximumFractionDigits: 0})} ${curr}</td>
    </tr>
    <tr>
        <td>Change (24hrs)</td>
        <td style="color:${col};">${change.toFixed(2)}%</td>
    </tr>
    <tr>
        <td>24h High</td>
        <td>${high24h.toLocaleString(undefined, {maximumFractionDigits: 8})} ${curr}</td>
    </tr>
    <tr>
        <td>24h Low</td>
        <td>${low24h.toLocaleString(undefined, {maximumFractionDigits: 8})} ${curr}</td>
    </tr>
    <tr>
        <td>Last Updated</td>
        <td>${lastUpdated}</td>
    </tr>
    `;
    // Animate table fade-in
    res.classList.remove('fade-in');
    void res.offsetWidth; // trigger reflow
    res.classList.add('fade-in');
};

// Animation on scroll for sections and images
function animateOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const slideEls = document.querySelectorAll('.slide-in-left');
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
  slideEls.forEach(el => observer.observe(el));
}

// Chart.js chart instance
let coinChartInstance = null;

document.getElementById('showChartBtn').addEventListener('click', async function() {
    const ctype = form.elements.coinType.value;
    await showCoinChart(ctype);
});

async function showCoinChart(coinId) {
    const chartContainer = document.getElementById('chartContainer');
    const canvas = document.getElementById('coinChart');
    // Reset canvas to fix rendering issues
    canvas.width = canvas.offsetWidth;
    canvas.height = 120;
    chartContainer.style.display = 'block';
    try {
        // Fetch 7 days of historical price data (hourly)
        const resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: 7,
                interval: 'hourly'
            }
        });
        const prices = resp.data.prices;
        const labels = prices.map(p => {
            const d = new Date(p[0]);
            return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:00`;
        });
        const data = prices.map(p => p[1]);
        // Destroy previous chart if exists
        if (coinChartInstance) {
            coinChartInstance.destroy();
        }
        coinChartInstance = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price (USD)',
                    data: data,
                    borderColor: '#ff512f',
                    backgroundColor: 'rgba(255,81,47,0.08)',
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: '7-Day Price Chart (USD)' }
                },
                scales: {
                    x: { display: false },
                    y: { beginAtZero: false }
                }
            }
        });
    } catch (err) {
        chartContainer.style.display = 'none';
        alert('Failed to load chart data. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to sections and about image
  document.querySelectorAll('section').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'fade-in' : 'slide-in-left');
  });
  const aboutImg = document.querySelector('#about img');
  if (aboutImg) aboutImg.classList.add('fade-in');
  animateOnScroll();
  enhanceDropdownWithLogos();
});
