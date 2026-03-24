require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize database connection and schema
require('./db/index');

// Import Routes (Uncomment as these are built)
const authRoutes = require('./routes/auth');
// const scanRoutes = require('./routes/scan');
// const removalRoutes = require('./routes/removals');
// const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse incoming JSON payloads

// Health Check Route (Good for testing if the server is alive)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'SafeTrace API is running cleanly.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
// app.use('/api/scan', scanRoutes);
// app.use('/api/removals', removalRoutes);
// app.use('/api/user', userRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🛡️ SafeTrace Server running on port ${PORT}`);
});