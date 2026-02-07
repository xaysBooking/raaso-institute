const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    classNumber: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['level 1', 'level 2', 'level 3']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
