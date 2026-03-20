const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const rawApiUrl = process.env.API_URL || 'http://localhost:3000';
const API_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `http://${rawApiUrl}`;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy API requests to uniblock-migration backend
app.use('/api', async (req, res) => {
  const url = `${API_URL}/api${req.url}`;
  console.log(`Proxying: ${req.method} ${req.url} -> ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Backend returned ${response.status} for ${url}`);
      return res.status(response.status).json({ error: `Backend returned ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`API proxy error for ${url}: ${err.message}`);
    res.status(502).json({ error: 'Backend unavailable', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
  console.log(`Proxying API to ${API_URL}`);
  console.log(`Raw API_URL env: "${process.env.API_URL}"`);
});
