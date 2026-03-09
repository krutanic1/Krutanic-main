import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
        green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
        red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
    };

    const theme = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 ${theme.bg} transition-all hover:shadow-md`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${theme.icon} ${theme.text}`}>
                <i className={`fa ${icon}`}></i>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className={`text-2xl font-bold ${theme.text}`}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
