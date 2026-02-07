import React, { useState } from 'react';
import { 
    useGetStudentsQuery, 
    useCreateStudentMutation, 
    useUpdateStudentMutation, 
    useDeleteStudentMutation 
} from '../../features/api/apiSlice';
import * as XLSX from 'xlsx';

const Students = () => {
    const { data: students, isLoading } = useGetStudentsQuery();
    const [createStudent] = useCreateStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [deleteStudent] = useDeleteStudentMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', classNumber: '', level: 'level 1' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await updateStudent({ id: editingStudent._id, ...formData }).unwrap();
            } else {
                await createStudent(formData).unwrap();
            }
            closeModal();
        } catch (err) {
            console.error('Failed to save student:', err);
        }
    };

    const openModal = (student = null) => {
        if (student) {
            setEditingStudent(student);
            setFormData({ name: student.name, classNumber: student.classNumber, level: student.level });
        } else {
            setEditingStudent(null);
            setFormData({ name: '', classNumber: '', level: 'level 1' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            await deleteStudent(id);
        }
    };

    const exportToExcel = () => {
        if (!students || students.length === 0) return;

        // Prepare data: only name and code as requested
        const exportData = students.map(student => ({
            'Student Name': student.name,
            'Student Code': student.code,
            'Level': student.level
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        // Professional formatting for the file name: [Institute]-Students-[Date]
        const fileName = `Machad-Raaso-Students-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Records</h1>
                    <p className="text-slate-500 font-medium">Maintain the central registry of student academic profiles.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                        onClick={exportToExcel}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        📊 Export Codes
                    </button>
                    <button 
                        onClick={() => openModal()} 
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-800 hover:shadow-none transition-all active:scale-95"
                    >
                        Register Student
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">ID Code</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Academic Level</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Class No.</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students?.map(student => (
                                <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-mono font-bold text-sm rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {student.code}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-slate-700">{student.name}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">
                                            {student.level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center text-slate-600 font-medium">{student.classNumber}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-4">
                                            <button 
                                                onClick={() => openModal(student)} 
                                                className="text-indigo-600 font-bold text-sm hover:text-slate-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(student._id)} 
                                                className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">{editingStudent ? 'Update Profile' : 'Student Registration'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Student Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Class Number</label>
                                    <input 
                                        type="number" 
                                        value={formData.classNumber}
                                        onChange={(e) => setFormData({...formData, classNumber: e.target.value})}
                                        required 
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Academic Level</label>
                                    <select 
                                        value={formData.level}
                                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-slate-800 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ4M2I4Iiwgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOSA5bC03IDctNy03Ii8+PC9zdmc+')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                                    >
                                        <option value="level 1">Level 1</option>
                                        <option value="level 2">Level 2</option>
                                        <option value="level 3">Level 3</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-6">
                                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-800 hover:shadow-none transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
