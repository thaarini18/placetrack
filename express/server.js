require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));


// Schema and Model
const recordSchema = new mongoose.Schema({
  studentName: String,
  company: String,
  role: String,
  ctc: Number,
  type: String,
  status: { type: String, default: "Pending" }
});

const Record = mongoose.model("Record", recordSchema);


// Auth Middleware
const SECRET_KEY = 'placetrack2025';

function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing API key.' });
  }
  next();
}

app.use('/api', authMiddleware);


// GET all records (MongoDB)
app.get('/api/tasks', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST add new record (MongoDB)
app.post('/api/add', async (req, res) => {
  try {
    const { studentName, company, role, ctc, type } = req.body;

    if (!studentName || !company || !role || !ctc || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newRecord = new Record({
      studentName,
      company,
      role,
      ctc: Number(ctc),
      type
    });

    await newRecord.save();
    res.status(201).json(newRecord);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE status by id (MongoDB)
app.get('/api/update/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const cycle = {
      'Pending': 'Approved',
      'Approved': 'Rejected',
      'Rejected': 'Pending'
    };

    record.status = cycle[record.status] || 'Pending';
    await record.save();

    res.json(record);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE record (MongoDB)
app.delete('/api/delete/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
