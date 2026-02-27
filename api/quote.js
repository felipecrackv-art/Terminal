export default async function handler(req, res) {
  const { symbol, modules } = req.query;
  if (!symbol) return res.status(400).json({ error: "No symbol" });

  const mods = modules || "price,summaryDetail,defaultKeyStatistics,financialData,earningsTrend,recommendationTrend,upgradeDowngradeHistory,assetProfile,incomeStatementHistory,balanceSheetHistory,cashflowStatementHistory";

  try {
    const [summary, news] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${mods}`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      }).then(r => r.json()),
      fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&newsCount=10`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      }).then(r => r.json()),
    ]);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ summary, news });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
