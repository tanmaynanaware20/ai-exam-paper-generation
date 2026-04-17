import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema({
  subject: String,
  units: [String]
});

export default mongoose.model('Syllabus', syllabusSchema);