
// const express = require('express');
// const router = express.Router();
// const Task = require('../models/Task');

// // Create task
// router.post('/', async (req, res) => {
//   try {
//     const task = await Task.create(req.body);
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all tasks
// router.get('/', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedTask);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE a task
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedTask);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // DELETE a task
// router.delete('/:id', async (req, res) => {
//   try {
//     await Task.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Task deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           title: req.body.title,
//           description: req.body.description,
//           dueDate: req.body.dueDate,
//           completed: req.body.completed,
//           priority: req.body.priority || 0,
//         },
//       },
//       { new: true }
//     );
//     res.json(updatedTask);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(err);
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// CREATE task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      completed: req.body.completed || false,
      priority: req.body.priority || 0,
      owner: req.user?._id, // remove if you don’t use auth
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          completed: req.body.completed,
          priority: req.body.priority || 0,
        },
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
