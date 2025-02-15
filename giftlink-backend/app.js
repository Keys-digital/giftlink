/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3061; // New port number

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
// Task 1: Import the giftRoutes and store in a constant called giftRoutes
const giftRoutes = require('./routes/giftRoutes'); // Import giftRoutes from the giftRoutes file

// Search API Task 1: Import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes'); // Import searchRoutes 

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// Task 2: Add the giftRoutes to the server by using the app.use() method.
app.use('/api/gifts', giftRoutes); // Attach giftRoutes to handle requests to /api/gifts

// Search API Task 2: Add the searchRoutes to the server by using the app.use() method.
app.use('/api/search', searchRoutes); // Attach searchRoutes to handle requests to /api/search 

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
