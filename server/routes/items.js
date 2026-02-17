const express = require('express');
const router = express.Router();
const { Career, Question, Roadmap, CollegeExam } = require('../models/models');

// Get all careers
router.get('/careers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const type = req.query.type; // support filtering by type if frontend eventually sends it
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            // Use text search if available and indexed, otherwise simplified regex on indexed title
            // For now, regex on title is efficient enough if indexed.
            // Text search is better: { $text: { $search: search } } but requires text index creation which we did.
            // However, regex offers partial matches (e.g. "Engin" matches "Engineer"). Text search usually needs full words.
            // Let's stick to Regex for partial match UX, but limit to title for speed if description is too heavy,
            // or use $or if we want breadth.
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    // Searching description might be slow without text index, but with .lean() it's faster.
                    // We added text index, so we COULD use $text, but let's stick to regex for partials for now.
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (type) {
            query.type = type;
        }

        // Parallelize count and find
        const [total, careers] = await Promise.all([
            Career.countDocuments(query),
            Career.find(query).select('-subCareers').skip(skip).limit(limit).lean() // Exclude subCareers for list view speed
        ]);

        res.json({
            careers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single career
router.get('/careers/:id', async (req, res) => {
    try {
        const career = await Career.findOne({ id: req.params.id }).lean();
        if (!career) return res.status(404).json({ message: 'Career not found' });
        res.json(career);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all questions
router.get('/questions', async (req, res) => {
    try {
        // Questions are small, but .lean() helps.
        const questions = await Question.find().lean();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all roadmaps
router.get('/roadmaps', async (req, res) => {
    try {
        // Roadmaps might have many steps. 
        // If client only needs list of titles for sidebar, we should optimize, 
        // but currently it loads all.
        const roadmaps = await Roadmap.find().lean();
        res.json(roadmaps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all colleges/exams
router.get('/colleges', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const type = req.query.type; // Optional: filter by type ('Exam' or 'College')

        let query = {};
        if (type) {
            query.type = type;
        }

        const search = req.query.search || '';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { stream: { $regex: search, $options: 'i' } }
            ];
        }

        // Parallelize
        const [total, items] = await Promise.all([
            CollegeExam.countDocuments(query),
            CollegeExam.find(query).skip(skip).limit(limit).lean()
        ]);

        // Client side expects { exams, colleges } split if they are mixed,
        // but with pagination and filtering, we usually get one type or a mix.
        // We will return the same structure as before but strictly based on the fetched items.

        const exams = items.filter(item => item.type === 'Exam');
        const colleges = items.filter(item => item.type === 'College');

        res.json({
            items, // Return all valid items for the page
            exams, // Convenience separation
            colleges, // Convenience separation
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
