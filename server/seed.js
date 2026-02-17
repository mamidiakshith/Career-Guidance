const mongoose = require('mongoose');
const { Career, Question, Roadmap, CollegeExam } = require('./models/models');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to DB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/career-guidance';
console.log(`Attempting to connect to DB...`); // Don't log full URI for security in logs if real
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected to Seed'))
    .catch(err => console.log(err));

// Read JSON files from Client data folder
const dataPath = path.join(__dirname, '../client/src/data');

const seedDB = async () => {
    try {
        // Clear existing data
        await Career.deleteMany({});
        await Question.deleteMany({});
        await Roadmap.deleteMany({});
        await CollegeExam.deleteMany({});

        // Read Data
        const careers = JSON.parse(fs.readFileSync(path.join(dataPath, 'careers_india.json'), 'utf-8'));
        const questions = JSON.parse(fs.readFileSync(path.join(dataPath, 'questions.json'), 'utf-8'));
        const roadmaps = JSON.parse(fs.readFileSync(path.join(dataPath, 'roadmaps.json'), 'utf-8'));
        const collegesData = JSON.parse(fs.readFileSync(path.join(dataPath, 'colleges.json'), 'utf-8'));

        // Insert Data
        await Career.insertMany(careers);
        await Question.insertMany(questions);
        await Roadmap.insertMany(roadmaps);

        // Transform Colleges/Exams data structure for flat DB storage if needed, or keep as is?
        // The Schema has 'type' field. The JSON has "exams": [...] and "colleges": [...]
        // We need to flatten this.

        const examDocs = collegesData.exams.map(e => ({ ...e, type: 'Exam' }));
        const collegeDocs = collegesData.colleges.map(c => ({ ...c, type: 'College' }));

        await CollegeExam.insertMany([...examDocs, ...collegeDocs]);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
