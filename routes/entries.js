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
    const entries = await Entry.find({
        $or: [
            { tags: { $in: [query.tag] } },
            { title: { $regex: query.keyword, $options: 'i' } },
            { content: { $regex: query.keyword, $options: 'i' } },
        ],
    });
    res.send(entries);
});

module.exports = router;
