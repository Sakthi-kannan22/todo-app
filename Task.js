
// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   dueDate: Date,
//   completed: { type: Boolean, default: false },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// }, { timestamps: true });

// module.exports = mongoose.model('Task', taskSchema);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  priority: {
    type: Number,
    default: 0,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
