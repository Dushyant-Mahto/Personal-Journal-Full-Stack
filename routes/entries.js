const express = require('express');
const Entry = require('../models/entry');
const router = express.Router();

// Create a new entry
router.post('/entries', async (req, res) => {
    try {
        const newEntry = new Entry(req.body);
        await newEntry.save();
        res.status(201).send(newEntry); // Send a status code 201 for creation
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed to create entry', details: error.message });
    }
});

// Get all entries
router.get('/entries', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.status(200).send(entries); // Send a status code 200 for success
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch entries', details: error.message });
    }
});

// Update an entry
router.put('/entries/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEntry) {
            return res.status(404).send({ error: 'Entry not found' });
        }
        res.send(updatedEntry);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed to update entry', details: error.message });
    }
});

// Delete an entry
router.delete('/entries/:id', async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).send({ error: 'Entry not found' });
        }
        res.status(204).send(); // No content to send back on successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to delete entry', details: error.message });
    }
});

// Search entries by tag or keyword
router.get('/entries/search', async (req, res) => {
    const { tag, keyword } = req.query;

    const query = {
        $or: []
    };

    if (tag) {
        query.$or.push({ tags: { $in: [tag] } });
    }

    if (keyword) {
        query.$or.push(
            { title: { $regex: keyword, $options: 'i' } },
            { content: { $regex: keyword, $options: 'i' } }
        );
    }

    if (query.$or.length === 0) {
        return res.status(400).send({ error: 'Please provide a tag or keyword for search.' });
    }

    try {
        const entries = await Entry.find(query);
        res.status(200).send(entries);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch search results', details: error.message });
    }
});

module.exports = router;
