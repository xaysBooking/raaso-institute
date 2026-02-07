import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/machad-logo.png';

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl"
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 flex flex-col shadow-2xl transition-transform duration-300 transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:relative lg:translate-x-0
            `}>
                <div className="p-8 border-b border-slate-800 flex items-center gap-4">
                    <img src={logo} alt="Logo" className="w-10 h-10 drop-shadow-lg" />
                    <h2 className="text-xl font-black text-white tracking-tight leading-tight">Machad <span className="text-indigo-400 block text-xs tracking-widest uppercase">Raasoo Admin</span></h2>
                </div>
                
                <nav className="flex-1 py-10 px-4 space-y-2">
                    <NavLink 
                        to="/admin" 
                        end 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all group ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Dashboard
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/students" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all group ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">👥</span> Students
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/results" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all group ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">📝</span> Exam Results
                    </NavLink>
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                        <span>🚪</span> Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-10 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-800">Administrator</div>
                            <div className="text-xs font-semibold text-slate-400 capitalize">{user?.username}</div>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-md border-2 border-white">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
