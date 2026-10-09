export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const { number } = req.query;
  const key = req.query.key || req.query.slug || null;

  if (!number) {
    return res.status(400).json({
      status: "error",
      message: "number parameter required",
      developer: "Naresh"
    });
  }

  if (!key) {
    return res.status(401).json({
      status: "error",
      message: "key required",
      developer: "Naresh"
    });
  }

  if (!key.startsWith('Naresh-')) {
    return res.status(401).json({
      status: "error",
      message: "invalid key",
      developer: "Naresh"
    });
  }

  try {
    const upstream = await fetch(
      `https://numberinfo-api-adibhai.vercel.app/api/number?number=${encodeURIComponent(number)}`
    );
    const data = await upstream.json();

    const rawData = data.data || {};

    return res.status(200).json({
      status: data.status || "success",
      number: data.number || number,
      data: {
        name: rawData.name || rawData.Name || "N/A",
        fname: rawData.fname || rawData.father_name || rawData.fatherName || rawData.Fname || "N/A",
        Address: rawData.Address || rawData.address || rawData.location || "N/A",
        alt_number: rawData.alt_number || rawData.alt_num || rawData.altnum || rawData.altPhone || "N/A",
        aadhar_id_number: rawData.aadhar_id_number || rawData.aadhar || rawData.aadhaar || rawData.aadhar_num || "[Aadhaar Redacted]"
      },
      developer: "Naresh"
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "upstream fetch failed",
      developer: "Naresh"
    });
  }
}
