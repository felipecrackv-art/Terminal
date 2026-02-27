export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "No symbol" });

  const modules = "price,summaryDetail,defaultKeyStatistics,financialData,earningsTrend,recommendationTrend,upgradeDowngradeHistory,assetProfile,incomeStatementHistory,balanceSheetHistory,cashflowStatementHistory";

  try {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://finance.yahoo.com",
      "Origin": "https://finance.yahoo.com"
    };

    const [summary, news] = await Promise.all([
      fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${modules}&crumb=`, { headers }).then(r => r.json()),
      fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&newsCount=10`, { headers }).then(r => r.json()),
    ]);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ summary, news });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
