import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/machad-logo.png';

const Home = () => {
    const [studentCode, setStudentCode] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (studentCode.trim()) {
            navigate(`/result/${studentCode.trim()}`);
        }
    };

    return (
        <div className="min-h-screen  flex flex-col font-sans" dir="rtl">
            {/* Hero Section */}
            <header className=" py-20 sm:py-32 relative overflow-hidden text-indigo-300">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-blue-500 rounded-full blur-[100px]"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center text-blue-900">
                    <div className="mb-10 animate-in zoom-in duration-700">
                        <img src={logo} alt="معهد راسو" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-2xl" />
                    </div>
                    <div className="inline-block bg-indigo-500/20 text-indigo-00 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
                        بوابة النتائج الرسمية
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
                نتائج الطلاب
                    </h1>
                    <p className="text-lg sm:text-xl text-indigo-800 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        مرحباً بكم في البوابة الأكاديمية لمعهد راسو للدراسات الإسلامية. الرجاء إدخال كود الطالب الخاص بك لعرض النتائج التفصيلية.
                    </p>
                    
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                            <input 
                                type="text" 
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                placeholder="أدخل كود الطالب (مثال: 34L2)"
                                className="flex-1 bg-white px-6 py-4 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner placeholder:text-slate-400 text-center"
                                required
                            />
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-10 rounded-xl transition-all shadow-lg active:scale-95 text-lg">
                                عرض النتيجة
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-slate-400 text-sm font-bold">
                        التنسيق القياسي: <span className="text-indigo-300 font-mono" dir="ltr">[Rank][Level]</span> (مثال: 34L2)
                    </p>
                </div>
            </header>
            
            {/* Features Section - Kept but translated for better UI flow */}
            {/* <section className="py-24 container mx-auto px-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon="📊" 
                        title="بيانات شاملة" 
                        text="تفاصيل الدرجات لكل مادة مع المجموع العام، المعدل المئوي، والترتيب على مستوى الصف."
                    />
                    <FeatureCard 
                        icon="🏆" 
                        title="ترتيب رسمي" 
                        text="ترتيب معتمد للطلاب بناءً على المعايير الأكاديمية الدقيقة لمعهد راسو."
                    />
                    <FeatureCard 
                        icon="🛡️" 
                        title="سجلات موثقة" 
                        text="النتائج مستخرجة مباشرة من قاعدة بيانات الإدارة الأكاديمية لضمان دقة كاملة."
                    />
                </div>
            </section> */}

            {/* Footer */}
            <footer className="py-10 border-t border-slate-200 text-center bg-white">
                <div className="container mx-auto px-6">
                    <p className="font-bold text-slate-800 text-lg mb-2">معهد راسو للدراسات الإسلامية</p>
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; 2026 جميع الحقوق محفوظة. بوابة النتائج الأكاديمية الآمنة.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, text }) => (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all group">
        <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{text}</p>
    </div>
);

export default Home;
