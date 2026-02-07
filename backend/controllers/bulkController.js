const xlsx = require('xlsx');
const Result = require('../models/resultModel');
const Student = require('../models/studentModel');

// Expected Arabic subject headers
const ARABIC_SUBJECTS = [
    'القرآن',
    'علوم القرآن',
    'الحديث',
    'علوم الحديث',
    'الفقه',
    'السيرة',
    'النحو',
    'الصرف',
    'اللغة'
];

/**
 * Normalizes Arabic text to handle common variants (Alef with/without hamza, etc.)
 */
const normalizeArabic = (text) => {
    if (!text) return '';
    return text.toString()
        .trim()
        .replace(/[أإآ]/g, 'ا') // Replace all Alef variants with plain Alef
        .replace(/ة/g, 'ه')     // Handle Teh Marbuta vs Heh
        .replace(/\s+/g, ' ');  // Collapse multiple spaces
};

const bulkImportResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { academicYear, level } = req.body;
        if (!academicYear || !level) {
            return res.status(400).json({ message: 'Academic Year and Level are required' });
        }

        // Read the workbook from buffer
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'The Excel file is empty' });
        }

        // Identify subject columns from headers
        // We assume the first row with data has all the headers
        const firstRow = data[0];
        const nameKey = Object.keys(firstRow).find(key => normalizeArabic(key) === normalizeArabic('الإسم'));
        
        if (!nameKey) {
            return res.status(400).json({ message: 'Could not find the "الإسم" (Name) column.' });
        }

        // Subject columns are all columns except the name column
        const subjectColumns = Object.keys(firstRow).filter(key => key !== nameKey);

        const importStats = {
            success: 0,
            failed: 0,
            skipped: 0,
            studentsCreated: 0,
            errors: []
        };

        const levelNumber = level.split(' ')[1];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const currentIndex = i + 1;

            try {
                const studentName = row[nameKey];

                if (!studentName) {
                    importStats.skipped++;
                    continue;
                }

                // Generate index-based code: [index]L[levelNumber]
                const code = `${currentIndex}L${levelNumber}`;

                // Find or Create Student
                let student = await Student.findOne({ code });
                
                if (!student) {
                    student = new Student({
                        name: studentName.trim(),
                        classNumber: currentIndex,
                        level,
                        code
                    });
                    await student.save();
                    importStats.studentsCreated++;
                } else {
                    // Update name if different
                    if (student.name.trim() !== studentName.trim()) {
                        student.name = studentName.trim();
                        await student.save();
                    }
                }

                // Extract subjects based on detected columns
                const subjects = [];
                for (const colName of subjectColumns) {
                    let score = Number(row[colName]);
                    
                    // If no value is recorded or it's not a number, it means 0 for that subject
                    if (isNaN(score)) {
                        score = 0;
                    }

                    subjects.push({
                        name: colName.trim(),
                        score: score
                    });
                }

                // Upsert result
                const existingResult = await Result.findOne({ student: student._id, academicYear });

                if (existingResult) {
                    existingResult.subjects = subjects;
                    existingResult.level = level; 
                    await existingResult.save();
                } else {
                    const newResult = new Result({
                        student: student._id,
                        studentCode: student.code,
                        level: level,
                        academicYear,
                        subjects
                    });
                    await newResult.save();
                }

                importStats.success++;
            } catch (err) {
                importStats.failed++;
                importStats.errors.push(`Error processing row ${currentIndex}: ${err.message}`);
            }
        }

        // --- RECALCULATE RANKS ---
        // Fetch all results for this level and year, sort by total descending
        const allResults = await Result.find({ level, academicYear }).sort({ total: -1 });
        
        for (let i = 0; i < allResults.length; i++) {
            allResults[i].rank = i + 1;
            await allResults[i].save();
        }

        res.json({
            message: 'Import completed',
            stats: importStats
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    bulkImportResults
};
