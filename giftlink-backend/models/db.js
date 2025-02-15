// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    // Task 1: Connect to MongoDB
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    // Task 1: Connect to MongoDB
    await client.connect(); // This establishes the connection to MongoDB

    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName); // Store the database instance in dbInstance

    // Task 3: Return database instance
    return dbInstance; // Return the dbInstance to be used in other parts of the application
}

module.exports = connectToDatabase;
