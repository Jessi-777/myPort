const express = require('express');
const router = express.Router();
const Film = require('../models/Film');

router.get('/', async (req, res) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const newFilm = new Film(req.body);
  try {
    const saved = await newFilm.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Film not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Film.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Film not found' });
    res.json({ message: 'Film deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Film = require('../models/Film');

// router.get('/', async (req, res) => {
//   try {
//     const films = await Film.find();
//     res.json(films);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
