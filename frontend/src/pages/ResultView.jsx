import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSearchResultQuery } from '../features/api/apiSlice';
import logo from '../assets/machad-logo.png';

const ResultView = () => {
    const { code } = useParams();
    const { data: result, isLoading, error } = useSearchResultQuery(code);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/70" dir="rtl">
                <div className="text-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    <p className="mt-3 text-gray-600 font-medium font-sans">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
                <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 font-sans">السجل غير موجود</h2>
                    <p className="text-gray-600 mb-6 font-sans">
                        {error.data?.message || "لا يوجد سجل يطابق هذا الكود."}
                    </p>
                    <Link to="/" className="inline-block bg-indigo-700 text-white px-6 py-2.5 rounded font-bold hover:bg-indigo-800 transition-colors">
                        العودة للبحث
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-2 print:bg-white print:p-0 print:min-h-0 font-sans" dir="rtl">
            <div className="mx-auto max-w-4xl print:max-w-none">
                {/* Controls - hidden on print */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                    <Link to="/" className="text-indigo-700 font-bold hover:text-indigo-900 flex items-center gap-1">
                        ← رجوع
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded font-bold hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
                    >
                        🖨️ طباعة / PDF
                    </button>
                </div>

                {/* Printable content */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden print:shadow-none print:border-0 print:rounded-none shadow-sm">
                    {/* Header - more compact */}
                    <div className="bg-gray-900 text-white px-6 py-6 md:py-7 print:py-4 print:px-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <img
                                src={logo}
                                alt="معهد راسو"
                                className="w-16 h-16 object-contain bg-white p-1 rounded-full shadow-lg"
                            />
                            <div className="text-center sm:text-right">
                                <div className="text-indigo-300 text-xs font-bold uppercase tracking-wide mb-0.5">
                                    كشف الدرجات الأكاديمي الرسمي
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-0.5">
                                    معهد راسو
                                </h1>
                                <p className="text-gray-300 text-sm sm:text-base font-bold">
                                    للدراسات الإسلامية واللغة العربية
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student info - tighter */}
                    <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-gray-100 bg-gray-50/50 print:py-4 print:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-7 text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                                    اسم الطالب
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {result.student.name}
                                </div>
                            </div>
                            <div className="sm:col-span-5 grid grid-cols-2 gap-4 sm:pt-0">
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                                        الكود
                                    </div>
                                    <div className="text-lg font-mono font-bold text-indigo-700">
                                        {result.student.code}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                                        العام الدراسي
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">
                                        {result.academicYear}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects - very compact */}
                    <div className="px-5 py-5 sm:px-8 sm:py-6 print:px-8 print:py-4">
                        <h2 className="text-center text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 print:mb-2 pb-2 border-b border-gray-50">
                            نتائج المواد الدراسية
                        </h2>

                        <div className="divide-y divide-gray-200 text-sm">
                            {result.subjects.map((subject, idx) => (
                                <div
                                    key={idx}
                                    className="py-2.5 flex justify-between items-center gap-4 print:py-2"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="font-bold text-gray-900 truncate">
                                            {subject.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 sm:gap-7 whitespace-nowrap">
                                        <div className="font-bold tabular-nums">
                                            {subject.score}
                                            <span className="text-gray-400 font-normal mr-1">/100</span>
                                        </div>
                                        <span
                                            className={`min-w-[52px] text-center px-2.5 py-0.5 rounded text-xs font-bold ${
                                                subject.score >= 50
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}
                                        >
                                            {subject.score >= 50 ? 'ناجح' : 'راسب'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary - more compact */}
                    <div className="bg-gray-900 text-white px-5 py-6 sm:px-8 sm:py-7 print:py-4 print:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-right">
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                                    المجموع
                                </div>
                                <div className="text-4xl sm:text-5xl font-bold">
                                    {result.total}
                                    <span className="text-xl sm:text-2xl font-normal opacity-50 mr-1">
                                        / {result.subjects.length * 100}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 sm:p-5 border border-white/10 flex flex-col items-center sm:items-start">
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 font-bold">
                                    المعدل
                                </div>
                                <div className="text-5xl sm:text-6xl font-bold text-indigo-300">
                                    {result.average.toFixed(1)}
                                    <span className="text-2xl opacity-70">%</span>
                                </div>
                                <div className="mt-2 text-lg font-bold">
                                    التقدير:{' '}
                                    {result.average >= 90 ? 'ممتاز' :
                                     result.average >= 80 ? 'جيد جداً' :
                                     result.average >= 70 ? 'جيد' :
                                     result.average >= 60 ? 'مقبول' :
                                     result.average >= 50 ? 'ضعيف' : 'راسب'}
                                </div>
                            </div>

                            <div className="flex flex-col items-center sm:items-end">
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                                    الترتيب
                                </div>
                                <div className="text-5xl sm:text-6xl font-bold flex items-baseline gap-1.5">
                                    <span className="text-3xl text-indigo-400 opacity-60">#</span>
                                    {result.rank || '—'}
                                </div>
                                <div className="text-sm text-gray-400 mt-1 font-bold">
                                    المستوى {result.level?.split(' ')?.[1] || '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer note - small & print-only friendly */}
                <div className="mt-6 text-center text-gray-500 text-[10px] font-bold uppercase tracking-wider print:mt-3 print:text-gray-600 print:hidden">
                    محرر إلكترونياً • تم التحقق في {new Date(result.createdAt).toLocaleDateString('ar-EG')} • معهد راسو
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm 12mm;
                    }

                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .print\\:hidden { display: none !important; }

                    h1, h2, div {
                        break-inside: avoid;
                    }

                    .shadow, .border, .rounded-lg {
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                    }

                    .py-6, .py-7, .py-5, .py-4, .py-8, .py-10 {
                        padding-top: 0.6rem !important;
                        padding-bottom: 0.6rem !important;
                    }

                    .px-5, .px-6, .px-8 {
                        padding-left: 0.8cm !important;
                        padding-right: 0.8cm !important;
                    }

                    .text-5xl, .text-6xl {
                        font-size: 2.4rem !important;
                        line-height: 1 !important;
                    }

                    .text-4xl {
                        font-size: 2rem !important;
                    }

                    .text-3xl {
                        font-size: 1.6rem !important;
                    }

                    .text-2xl {
                        font-size: 1.3rem !important;
                    }

                    .mb-6, .mb-5, .mb-3, .mb-8 {
                        margin-bottom: 0.4rem !important;
                    }

                    .gap-6, .gap-4 {
                        gap: 0.5rem !important;
                    }

                    .divide-y > * + * {
                        border-top-width: 0.5px !important;
                    }
                }

                @media print and (max-height: 950px) {
                    .text-6xl { font-size: 2.1rem !important; }
                    .text-5xl { font-size: 2rem !important; }
                    .py-4, .py-5 { padding: 0.4rem 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default ResultView;