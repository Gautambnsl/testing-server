const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://testing:snI9IryyybMOv13q@cluster0.fkslgsl.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});

// Define MongoDB Schema
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});
const Form = mongoose.model('Form', formSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/submit-form', async (req, res) => {
  try {
    console.log("somthing post")
    const { name, email, message } = req.body;
    const formData = new Form({ name, email, message });
    const savedForm = await formData.save();
    res.json({ success: true, id: savedForm._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
