import React, { useState } from 'react';
import { 
    useGetResultsQuery, 
    useGetStudentsQuery,
    useCreateResultMutation, 
    useUpdateResultMutation, 
    useDeleteResultMutation,
    useBulkImportResultsMutation
} from '../../features/api/apiSlice';

const Results = () => {
    const { data: results, isLoading: loadingResults } = useGetResultsQuery();
    const { data: students, isLoading: loadingStudents } = useGetStudentsQuery();
    const [createResult] = useCreateResultMutation();
    const [updateResult] = useUpdateResultMutation();
    const [deleteResult] = useDeleteResultMutation();
    const [bulkImport, { isLoading: isImporting }] = useBulkImportResultsMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingResult, setEditingResult] = useState(null);
    const [formData, setFormData] = useState({ 
        studentId: '', 
        academicYear: '2025-2026',
        subjects: [{ name: '', score: '' }] 
    });

    const [importData, setImportData] = useState({
        academicYear: '2025-2026',
        level: 'level 1',
        file: null
    });

    const addSubject = () => {
        setFormData({
            ...formData,
            subjects: [...formData.subjects, { name: '', score: '' }]
        });
    };

    const removeSubject = (index) => {
        const newSubjects = formData.subjects.filter((_, i) => i !== index);
        setFormData({ ...formData, subjects: newSubjects });
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][field] = field === 'score' ? Number(value) : value;
        setFormData({ ...formData, subjects: newSubjects });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResult) {
                await updateResult({ id: editingResult._id, ...formData }).unwrap();
            } else {
                await createResult(formData).unwrap();
            }
            closeModal();
        } catch (err) {
            console.error('Failed to save result:', err);
        }
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!importData.file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', importData.file);
        formData.append('academicYear', importData.academicYear);
        formData.append('level', importData.level);

        try {
            const res = await bulkImport(formData).unwrap();
            const stats = res.stats;
            alert(`Import Finished! 📈\n\n✅ Results Saved: ${stats.success}\n👤 New Students Created: ${stats.studentsCreated}\n⚠️ Failed: ${stats.failed}\n⏭️ Skipped (Empty rows): ${stats.skipped}\n\n${stats.errors.length > 0 ? 'Errors:\n' + stats.errors.join('\n') : ''}`);
            setIsImportModalOpen(false);
            setImportData({ academicYear: '2025-2026', level: 'level 1', file: null });
        } catch (err) {
            alert('Import failed: ' + (err.data?.message || err.message));
        }
    };

    const openModal = (result = null) => {
        if (result) {
            setEditingResult(result);
            setFormData({ 
                studentId: result.student._id, 
                academicYear: result.academicYear,
                subjects: result.subjects.map(s => ({ name: s.name, score: s.score }))
            });
        } else {
            setEditingResult(null);
            setFormData({ 
                studentId: '', 
                academicYear: '2025-2026',
                subjects: [{ name: '', score: '' }] 
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingResult(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            await deleteResult(id);
        }
    };

    if (loadingResults || loadingStudents) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Examination Outcomes</h1>
                    <p className="text-slate-500 font-medium">Record and analyze academic performance across the institute.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsImportModalOpen(true)} 
                        className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Bulk Import (Excel)
                    </button>
                    <button 
                        onClick={() => openModal()} 
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-800 hover:shadow-none transition-all active:scale-95"
                    >
                        Enter Exam Data
                    </button>
                </div>
            </div>

            {/* Same Results Table Code... */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Level</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Year</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Aggregate</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Avg %</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Rank</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {results?.map(result => (
                                <tr key={result._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-700">{result.student?.name}</div>
                                        <div className="text-xs font-mono font-bold text-indigo-400">{result.studentCode}</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter rounded border border-slate-200">
                                            {result.level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center text-slate-600 font-bold text-sm tracking-tighter">{result.academicYear}</td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="text-lg font-black text-slate-800">{result.total}</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="text-md font-black text-indigo-600">{result.average.toFixed(1)}%</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-black text-xs">
                                            {result.rank || '-'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => openModal(result)} 
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                                                title="Edit Result"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(result._id)} 
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete Result"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">{editingResult ? 'Modify Grade Record' : 'Enter Examination Scores'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Student Profile</label>
                                    <select 
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                        required
                                        disabled={!!editingResult}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-slate-800 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ4M2I4Iiwgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOSA5bC03IDctNy03Ii8+PC9zdmc+')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                                    >
                                        <option value="">Choose student...</option>
                                        {students?.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Academic Year</label>
                                    <input 
                                        type="text" 
                                        value={formData.academicYear}
                                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                        required 
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-black text-slate-800">Subject-wise Scores</h3>
                                    <button 
                                        type="button" 
                                        onClick={addSubject} 
                                        className="text-indigo-600 font-bold text-sm hover:underline"
                                    >
                                        + Add Subject Row
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.subjects.map((subject, index) => (
                                        <div key={index} className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-200">
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    placeholder="Subject Name"
                                                    value={subject.name}
                                                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                                                    required
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input 
                                                    type="number" 
                                                    placeholder="Score"
                                                    value={subject.score}
                                                    onChange={(e) => handleSubjectChange(index, 'score', e.target.value)}
                                                    required
                                                    min="0"
                                                    max="100"
                                                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-black text-center text-slate-800"
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeSubject(index)} 
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-0"
                                                disabled={formData.subjects.length === 1}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-800 hover:shadow-none transition-all">Submit Results</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Bulk Results Import</h2>
                        <form onSubmit={handleImportSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Academic Year</label>
                                    <input 
                                        type="text" 
                                        value={importData.academicYear}
                                        onChange={(e) => setImportData({...importData, academicYear: e.target.value})}
                                        required 
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Academic Level</label>
                                <select 
                                    value={importData.level}
                                    onChange={(e) => setImportData({...importData, level: e.target.value})}
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-slate-800 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ4M2I4Iiwgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOSA5bC03IDctNy03Ii8+PC9zdmc+')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                                >
                                    <option value="level 1">Level 1</option>
                                    <option value="level 2">Level 2</option>
                                    <option value="level 3">Level 3</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Excel File (.xlsx)</label>
                                <input 
                                    type="file" 
                                    accept=".xlsx"
                                    onChange={(e) => setImportData({...importData, file: e.target.files[0]})}
                                    required 
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-6">
                                <button type="button" onClick={() => setIsImportModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                                <button 
                                    type="submit" 
                                    disabled={isImporting}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-800 hover:shadow-none transition-all disabled:opacity-50"
                                >
                                    {isImporting ? 'Processing...' : 'Start Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
