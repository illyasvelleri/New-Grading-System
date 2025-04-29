// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  batch: String,
  attendance: {
    type: Object, // Use Object instead of Map
    default: {},
  },
  monthlySummary: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows dynamic fields like attendance, magazine, etc.
    default: {},
  },
  examSummary: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows dynamic fields like attendance, magazine, etc.
    default: {},
  }
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
