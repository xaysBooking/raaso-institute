const Student = require('../models/studentModel');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
    try {
        const { name, classNumber, level } = req.body;
        
        // Generate code: [classNumber]L[levelNumber]
        const levelNumber = level.split(' ')[1];
        const code = `${classNumber}L${levelNumber}`;

        // Check if student with this code already exists
        const studentExists = await Student.findOne({ code });
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this code already exists' });
        }

        const student = new Student({
            name,
            classNumber,
            level,
            code
        });

        const createdStudent = await student.save();
        res.status(201).json(createdStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    try {
        const { name, classNumber, level } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.name = name || student.name;
        student.classNumber = classNumber || student.classNumber;
        student.level = level || student.level;

        // If level or classNumber changed, update the code
        if (classNumber || level) {
            const levelNumber = student.level.split(' ')[1];
            student.code = `${student.classNumber}L${levelNumber}`;
        }

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
};
