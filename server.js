const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy API requests to uniblock-migration backend
app.use('/api', async (req, res) => {
  try {
    const url = `${API_URL}/api${req.url}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`API proxy error: ${err.message}`);
    res.status(502).json({ error: 'Backend unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard running on http://localhost:${PORT}`);
  console.log(`Proxying API to ${API_URL}`);
});
