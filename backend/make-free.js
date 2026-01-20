const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  const product = await Product.findByIdAndUpdate(
    '696f03e8de00d28f21529351',
    { 
      isFree: true,
      price: 0
    },
    { new: true }
  );
  
  if (product) {
    console.log('✅ Product updated to FREE:');
    console.log(`   ${product.title}`);
    console.log(`   isFree: ${product.isFree}`);
    console.log(`   price: $${product.price / 100}`);
  } else {
    console.log('❌ Product not found');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
