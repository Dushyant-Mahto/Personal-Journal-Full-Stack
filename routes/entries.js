const express = require('express');
const Entry = require('../models/entry');
const router = express.Router();

// Create a new entry
router.post('/entries', async (req, res) => {
    const newEntry = new Entry(req.body);
    await newEntry.save();
    res.send(newEntry);
});

// Get all entries
router.get('/entries', async (req, res) => {
    const entries = await Entry.find();
    res.send(entries);
});

// Update an entry
router.put('/entries/:id', async (req, res) => {
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedEntry);
});

// Delete an entry
router.delete('/entries/:id', async (req, res) => {
    const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
    res.send(deletedEntry);
});

// Search entries by tag or keyword
router.get('/entries/search', async (req, res) => {
    const { query } = req;
    const searchConditions = [];

    if (query.tag) {
        searchConditions.push({ tags: { $in: [query.tag] } });
    }

    if (query.keyword) {
        searchConditions.push({
            $or: [
                { title: { $regex: query.keyword, $options: 'i' } },
                { content: { $regex: query.keyword, $options: 'i' } },
            ],
        });
    }

    // If there are search conditions, use them; otherwise, return an empty array
    const entries = searchConditions.length > 0
        ? await Entry.find({ $or: searchConditions })
        : [];

    res.send(entries);
});


module.exports = router;