const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentCode: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['level 1', 'level 2', 'level 3']
    },
    subjects: [
        {
            name: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    average: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        default: 0
    },
    academicYear: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Calculate total and average before validation
resultSchema.pre('validate', function() {
    if (this.subjects && this.subjects.length > 0) {
        this.total = this.subjects.reduce((sum, subject) => sum + subject.score, 0);
        this.average = this.total / this.subjects.length;
    }
});

module.exports = mongoose.model('Result', resultSchema);
