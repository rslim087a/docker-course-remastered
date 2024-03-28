const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let grades = [];

app.get('/grades', (req, res) => {
  console.log('Received GET request for grades');
  res.json(grades);
});

app.post('/grades', (req, res) => {
  const { name, subject, score } = req.body;
  const id = Date.now().toString();
  const newGrade = { id, name, subject, score };
  grades.push(newGrade);
  console.log('Received POST request, added new grade:', newGrade);
  res.json(newGrade);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Grade service is running on port ${port}`);
});