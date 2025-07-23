const express = require('express');
const router = express.Router();
const Music = require('../models/Music');

router.get('/', async (req, res) => {
  try {
    const music = await Music.find();
    res.json(music);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Music.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Music not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const newItem = new Music(req.body);
  try {
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Music not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Music.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Music not found' });
    res.json({ message: 'Music deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Music = require('../models/Music');

// router.get('/', async (req, res) => {
//   try {
//     const music = await Music.find();
//     res.json(music);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
