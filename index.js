const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const os = require('os');
const cors = require('cors');

dotenv.config();
const app = express();

// Allow requests from React frontend (default: http://localhost:3000)
const allowedOrigins = [
  'http://localhost:3000',
  'https://vitara-affiliate-backend.onrender.com',
  'https://kb01owfmq6ip.vitara.app',
];
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type','Authorization'
  ],
};
app.use(cors(corsOpts));
app.use(bodyParser.json());

// Connect MongoDB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
const PORT = process.env.PORT || 3000;

// Print local IP
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let info of iface) {
      if (info.family === 'IPv4' && !info.internal) {
        return info.address;
      }
    }
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const ip = getLocalIP();
  console.log(`Server running on:
    - Localhost: http://localhost:${PORT}
    - LAN IP:    http://${ip}:${PORT}`);
});
