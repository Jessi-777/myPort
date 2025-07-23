const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('Yay! MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  // console.log("MONGO_URL from env:", process.env.MONGO_URL);

// Routes
app.use('/products', require('./routes/productRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/music', require('./routes/musicRoutes'));
app.use('/films', require('./routes/filmRoutes'));

app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
