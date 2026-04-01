require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. MIDDLEWARE
app.use(express.json()); // To parse JSON data from frontend
app.use(express.static('./public')); // To serve your HTML/JS files

// 3. MONGOOSE SCHEMA & MODEL
const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
        maxlength: [20, 'name cannot be more than 20 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Task = mongoose.model('Task', TaskSchema);

// 4. ROUTES (CRUD API)

// GET ALL TASKS
app.get('/api/v1/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// CREATE A TASK
app.post('/api/v1/tasks', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// DELETE A TASK
app.delete('/api/v1/tasks/:id', async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskID });
        if (!task) return res.status(404).json({ msg: `No task with id: ${taskID}` });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// UPDATE A TASK (Toggle Completion)
app.patch('/api/v1/tasks/:id', async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) return res.status(404).json({ msg: `No task with id: ${taskID}` });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// 5. DATABASE CONNECTION & SERVER START
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is listening on port ${PORT}...`);
            console.log(`👉 Open http://localhost:${PORT} in your browser`);
        });
    } catch (error) {
        console.log('❌ Connection Error:', error);
    }
};

start();