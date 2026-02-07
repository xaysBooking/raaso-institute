const Student = require('../models/studentModel');
const Result = require('../models/resultModel');

// @desc    Search student result by code
// @route   GET /api/public/search/:code
// @access  Public
const searchResultByCode = async (req, res) => {
    try {
        const { code } = req.params;

        // Find student by code
        const student = await Student.findOne({ code });
        if (!student) {
            return res.status(404).json({ message: 'Student not found. Please check your code.' });
        }

        // Find the latest result for this student
        const result = await Result.findOne({ student: student._id })
            .populate('student', 'name code classNumber level')
            .sort({ academicYear: -1, createdAt: -1 });

        if (!result) {
            return res.status(404).json({ message: 'No result found for this student.' });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    searchResultByCode
};
