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
  'http://localhost:3000', // React dev
  'https://vitara-affiliate-backend.onrender.com/', // replace with your actual frontend domain
  'https://kb01owfmq6ip.vitara.app/',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or auth headers
}));

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
