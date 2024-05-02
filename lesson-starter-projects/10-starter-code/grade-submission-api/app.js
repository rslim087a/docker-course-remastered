const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.CONNECTION_STRING}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define Grade schema
const gradeSchema = new mongoose.Schema({
  name: String,
  subject: String,
  score: Number,
});

// Create Grade model
const Grade = mongoose.model('Grade', gradeSchema);

app.get('/grades', async (req, res) => {
  console.log('Received GET request for grades');
  const grades = await Grade.find();
  res.json(grades);
});

app.post('/grades', async (req, res) => {
  const { name, subject, score } = req.body;
  const newGrade = new Grade({ name, subject, score });
  await newGrade.save();
  console.log('Received POST request, added new grade:', newGrade);
  res.json(newGrade);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Grade service is running on port ${port}`);
});
