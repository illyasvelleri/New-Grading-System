import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  roll: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: String,
    required: true,
  },

  // Stores summary data by month (e.g., { "2024-04": { attendance: 20, magazine: 5 } })
  monthlySummary: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Stores exam performance summary (e.g., { "term1": { math: 80, english: 75 } })
  examSummary: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Optional attendance log (e.g., { "2024-04-29": "present" })
  attendanceSummary: {
    type: Map,
    of: String, // 'present' or 'absent'
    default: {},
  },
  attendanceTotal: {
    type: Map,
    of: new mongoose.Schema({
      total: Number,
      workingDays: Number,
    }, { _id: false })
  },

}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);