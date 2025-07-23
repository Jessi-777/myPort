const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects with optional filters
router.get('/', async (req, res) => {
  const { category, inStock } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (inStock !== undefined) filter.inStock = inStock === 'true';

  try {
    const projects = await Project.find(filter);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project
router.post('/', async (req, res) => {
  const { name, price, description, imageUrl, category, inStock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const newProject = new Project({
    name,
    price,
    description,
    imageUrl,
    category,
    inStock: inStock !== undefined ? inStock : true
  });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ message: err.message });
  }
});


// Middleware to fetch project by ID
async function getProject(req, res, next) {
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.project = project;
  next();
}

// PUT (update) a project
router.put('/:id', getProject, async (req, res) => {
  const { name, price, description, imageUrl, category, inStock } = req.body;

  if (name != null) res.project.name = name;
  if (price != null) res.project.price = price;
  if (description != null) res.project.description = description;
  if (imageUrl != null) res.project.imageUrl = imageUrl;
  if (category != null) res.project.category = category;
  if (inStock != null) res.project.inStock = inStock;

  try {
    const updatedProject = await res.project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

