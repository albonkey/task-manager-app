const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    details: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    status: {
      type: String,
      enum: ['assigned', 'in progress', 'in review', 'completed']
    },
    timeline: {
      assigned: Date,
      due: Date,
      last_updated: { type: Date, default: Date.now() }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
  },{
    runValidators: true
  }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
