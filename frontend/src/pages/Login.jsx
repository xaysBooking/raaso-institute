import React, { useState } from 'react';
import { useLoginMutation } from '../features/api/apiSlice';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/machad-logo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ username, password }).unwrap();
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/admin');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] -ml-64 -mb-64 opacity-50"></div>

            <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-12 border border-white relative z-10 animate-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <img src={logo} alt="Raasoi Institute" className="w-24 h-24 mx-auto mb-6 drop-shadow-xl" />
                    <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100">
                        Administrator Access
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Machad <span className="text-indigo-600">Raasoo</span></h1>
                    <p className="text-slate-400 font-medium">Internal Records Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1" htmlFor="username">Username</label>
                        <input 
                            id="username"
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="e.g. admin_office"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1" htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold text-center animate-shake">
                            {error.data?.message || 'Verification failed. Please check credentials.'}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 hover:bg-slate-900 hover:shadow-none transition-all active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {isLoading ? 'Authenticating Access...' : 'Sign In Now'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <Link to="/" className="text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">
                        ← Return to Public Student Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
