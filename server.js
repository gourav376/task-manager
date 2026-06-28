require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Tell Express to serve the frontend files from the 'public' folder
app.use(express.static('public')); 

// 1. Database Connection
// Render will provide the MONGO_URI from the environment variables you set up
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// 2. Database Schema (How a task looks in the database)
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: 'pending' } // pending or completed
});
const Task = mongoose.model('Task', TaskSchema);

// 3. API Routes (CRUD Operations)

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.json(savedTask);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// 4. Fallback route: send the frontend HTML for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
