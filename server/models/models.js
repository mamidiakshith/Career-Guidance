const mongoose = require('mongoose');

// Career Schema
const CareerSchema = new mongoose.Schema({
    id: Number,
    title: { type: String, index: true }, // Index for sorting/filtering
    type: { type: String, index: true }, // R, I, A, S, E, C - Index for filtering
    description: String,
    salary: String,
    education: String,
    stream: String, // e.g. "Science (PCM)", "Commerce", "Arts"
    subjects: [String], // e.g. ["Physics", "Mathematics"]
    skills: [String], // e.g. ["Problem Solving", "Coding"]
    subCareers: [{
        title: String,
        description: String,
        skills: [String],
        salary: String
    }]
});

// Add text index for search
CareerSchema.index({ title: 'text', description: 'text' });

// Question Schema
const QuestionSchema = new mongoose.Schema({
    id: Number,
    question: String,
    type: String // R, I, A, S, E, C
});

// Roadmap Schema
const StepSchema = new mongoose.Schema({
    title: String,
    detail: String
});

const RoadmapSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    steps: [StepSchema]
});

// College/Exam Schema
const CollegeExamSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, index: true },
    type: { type: String, enum: ['Exam', 'College'], index: true }, // "Exam" or "College"
    stream: { type: String, index: true },
    description: String,
    date: String, // For Exams
    location: String, // For Colleges
    exam: String, // For Colleges (Entrance exam needed)
    rating: String // For Colleges
});

// Add text index for search
CollegeExamSchema.index({ name: 'text', stream: 'text' });

const Career = mongoose.model('Career', CareerSchema);
const Question = mongoose.model('Question', QuestionSchema);
const Roadmap = mongoose.model('Roadmap', RoadmapSchema);
const CollegeExam = mongoose.model('CollegeExam', CollegeExamSchema);

module.exports = { Career, Question, Roadmap, CollegeExam };
