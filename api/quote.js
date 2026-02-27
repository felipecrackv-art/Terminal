export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "No symbol" });

  res.setHeader("Access-Control-Allow-Origin", "*");

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://finance.yahoo.com",
  };

  try {
    // Step 1: Get crumb
    const cookieRes = await fetch("https://finance.yahoo.com/", { headers });
    const cookies = cookieRes.headers.get("set-cookie") || "";
    const cookieHeader = cookies.split(",").map(c => c.split(";")[0]).join("; ");

    const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: { ...headers, "Cookie": cookieHeader }
    });
    const crumb = await crumbRes.text();

    const authHeaders = { ...headers, "Cookie": cookieHeader };
    const modules = "price,summaryDetail,defaultKeyStatistics,financialData,earningsTrend,recommendationTrend,upgradeDowngradeHistory,assetProfile,incomeStatementHistory,balanceSheetHistory,cashflowStatementHistory";

    // Step 2: Fetch data with crumb
    const [summary, news] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`, { headers: authHeaders }).then(r => r.json()),
      fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&newsCount=10&crumb=${encodeURIComponent(crumb)}`, { headers: authHeaders }).then(r => r.json()),
    ]);

    res.json({ summary, news, crumb });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
