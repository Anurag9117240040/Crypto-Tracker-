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
    res.innerHTML = `
    <tr class="bg-primary" style="color: white;">
        <td>Property</td>
        <td>Value</td>
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
};