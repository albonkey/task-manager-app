const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true }
    },
    description: String,
    repository: String,
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
