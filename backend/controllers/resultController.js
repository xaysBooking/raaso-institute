const Result = require('../models/resultModel');
const Student = require('../models/studentModel');


const getResults = async (req, res) => {
    try {
        const results = await Result.find().populate('student', 'name code').sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const createResult = async (req, res) => {
    try {
        const { studentId, subjects, academicYear } = req.body;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const resultExists = await Result.findOne({ student: studentId, academicYear });
        if (resultExists) {
            return res.status(400).json({ message: 'Result for this student and academic year already exists' });
        }

        const result = new Result({
            student: studentId,
            studentCode: student.code,
            level: student.level,
            subjects,
            academicYear
        });

        const createdResult = await result.save();
        res.status(201).json(createdResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const updateResult = async (req, res) => {
    try {
        const { subjects, academicYear } = req.body;
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        result.subjects = subjects || result.subjects;
        result.academicYear = academicYear || result.academicYear;

        const updatedResult = await result.save();
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        await result.deleteOne();
        res.json({ message: 'Result removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getResults,
    createResult,
    updateResult,
    deleteResult
};
