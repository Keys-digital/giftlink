/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');

const app = express();
app.use("*", cors());

// Use process.env.PORT if available, fallback to 4000
const port = process.env.PORT || 4000;

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => pinoLogger.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
const giftRoutes = require('./routes/giftRoutes'); // Import giftRoutes from the giftRoutes file
const searchRoutes = require('./routes/searchRoutes'); // Import searchRoutes 

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/gifts', giftRoutes); // Attach giftRoutes to handle requests to /api/gifts
app.use('/api/search', searchRoutes); // Attach searchRoutes to handle requests to /api/search 

// Global Error Handler
app.use((err, req, res, next) => {
    pinoLogger.error('Internal Server Error', err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

// Listen on the specified port
app.listen(port, () => {
  pinoLogger.info(`Server is running on port ${port}`);
});
