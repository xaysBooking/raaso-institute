const express = require('express');
const { 
    getStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent 
} = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.route('/')
    .get(getStudents)
    .post(createStudent);

router.route('/:id')
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
