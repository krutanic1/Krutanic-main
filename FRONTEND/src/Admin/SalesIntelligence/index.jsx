import React, { useState } from 'react';
import ExecutiveDashboard from './ExecutiveDashboard';
import LeadAnalytics from './LeadAnalytics';
import SalesAnalytics from './SalesAnalytics';
import CounselorAnalytics from './CounselorAnalytics';
import CallAnalytics from './CallAnalytics';
import RevenueAnalytics from './RevenueAnalytics';
import ProgramAnalytics from './ProgramAnalytics';
import StudentAnalytics from './StudentAnalytics';
import AiInsights from './AiInsights';
import { LayoutDashboard, Users, Target, BarChart2, PhoneCall, DollarSign, BookOpen, GraduationCap, BrainCircuit } from 'lucide-react';
import './SalesIntelligence.css';

const TABS = [
    { id: 'executive', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'lead', label: 'Lead Analytics', icon: <Users size={18} /> },
    { id: 'sales', label: 'Sales & Funnel', icon: <Target size={18} /> },
    { id: 'counselor', label: 'Counselor Analytics', icon: <BarChart2 size={18} /> },
    { id: 'call', label: 'Call Analytics', icon: <PhoneCall size={18} /> },
    { id: 'revenue', label: 'Revenue Analytics', icon: <DollarSign size={18} /> },
    { id: 'program', label: 'Program Analytics', icon: <BookOpen size={18} /> },
    { id: 'student', label: 'Student Analytics', icon: <GraduationCap size={18} /> },
    { id: 'ai', label: 'AI Insights', icon: <BrainCircuit size={18} /> },
];

const SalesIntelligence = () => {
    const [activeTab, setActiveTab] = useState('executive');

    const renderContent = () => {
        switch (activeTab) {
            case 'executive': return <ExecutiveDashboard />;
            case 'lead': return <LeadAnalytics />;
            case 'sales': return <SalesAnalytics />;
            case 'counselor': return <CounselorAnalytics />;
            case 'call': return <CallAnalytics />;
            case 'revenue': return <RevenueAnalytics />;
            case 'program': return <ProgramAnalytics />;
            case 'student': return <StudentAnalytics />;
            case 'ai': return <AiInsights />;
            default: return <ExecutiveDashboard />;
        }
    };

    return (
        <div className="admin-content-wrap">
            <div className="si-dashboard-container">
                {/* Sidebar Navigation */}
                <div className="si-sidebar">
                    <h2 className="si-sidebar-title">Sales Intelligence</h2>
                    <ul className="si-nav-list">
                        {TABS.map(tab => (
                            <li 
                                key={tab.id}
                                className={`si-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="si-main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SalesIntelligence;
