// giftRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');  // Import the MongoDB connection function

// Retrieve all gifts
router.get('/', async (req, res) => { 
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase(); // Connect to the database

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts'); // Access the "gifts" collection

        // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray(); // Fetch all gifts

        // Task 4: Return the gifts using the res.json method
        res.json(gifts); // Return the array of gifts as a JSON response
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts'); // Handle any errors
    }
});

// Retrieve a specific gift by ID
router.get('/:id', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase(); // Connect to the database

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts'); // Access the "gifts" collection

        const id = req.params.id; // Get the ID from the request parameters

        // Task 3: Find a specific gift by ID using the collection.findOne method and store in constant called gift
        const gift = await collection.findOne({ id: id }); // Find the gift with the given ID

        // If no gift is found, return a 404 error
        if (!gift) {
            return res.status(404).send('Gift not found'); // Handle case where gift doesn't exist
        }

        res.json(gift); // Return the found gift as a JSON response
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift'); // Handle any errors
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // Connect to the database
        const collection = db.collection("gifts"); // Access the "gifts" collection
        const gift = await collection.insertOne(req.body); // Insert the new gift data into the collection

        res.status(201).json(gift.ops[0]); // Return the newly added gift
    } catch (e) {
        next(e); // Handle any errors during the insert operation
    }
});

module.exports = router; // Export the router for use in other parts of the application
