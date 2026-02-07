import React from 'react';
import { useGetStudentsQuery, useGetResultsQuery } from '../../features/api/apiSlice';

const Dashboard = () => {
    const { data: students, isLoading: loadingStudents } = useGetStudentsQuery();
    const { data: results, isLoading: loadingResults } = useGetResultsQuery();

    if (loadingStudents || loadingResults) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const stats = [
        { label: 'Total Students', value: students?.length || 0, icon: '👥', color: 'bg-blue-500' },
        { label: 'Results Published', value: results?.length || 0, icon: '📝', color: 'bg-emerald-500' },
        { label: 'Level 1', value: students?.filter(s => s.level === 'level 1').length || 0, icon: '🌱', color: 'bg-amber-400' },
        { label: 'Level 2 & 3', value: students?.filter(s => s.level !== 'level 1').length || 0, icon: '🚀', color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic Overview</h1>
                <p className="text-slate-500 font-medium">Monitoring student enrollment and performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform text-white`}>
                            {stat.icon}
                        </div>
                        <span className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</span>
                        <div className="text-4xl font-black text-slate-900">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl text-indigo-600">🏛️</div>
                    <h3 className="text-xl font-bold text-slate-800">System Information</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                    Welcome to the Raasoi Institute Exam Management System. This centralized portal allows administrators to maintain secure records of all student profiles and their corresponding examination results. 
                    Calculations for averages and totals are automated to ensure data integrity across the platform.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
