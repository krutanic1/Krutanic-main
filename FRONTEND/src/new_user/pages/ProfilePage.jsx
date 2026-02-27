import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../API";

const splitLines = (text) =>
    text ? text.split("\n").map((l) => l.trim()).filter(Boolean) : [];

const Tag = ({ text, colorClass = "bg-orange-50 text-orange-700 border-orange-200" }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold border ${colorClass}`}>
        {text}
    </span>
);

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
        <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <h3 className="text-[17px] font-bold text-gray-800 tracking-tight">{title}</h3>
    </div>
);

const EmptyState = ({ navigate }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-b from-white to-gray-50 rounded-3xl border border-dashed border-gray-300/80 shadow-sm">
        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-[48px] text-orange-500">account_circle</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your Profile is Empty</h3>
        <p className="text-gray-500 mb-8 max-w-sm text-[15px] leading-relaxed">
            Build your professional resume first. All your data will magically appear here dynamically.
        </p>
        <button
            className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3.5 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5"
            onClick={() => navigate("/advancedashboard/resume-builder")}
        >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">edit_document</span>
            Create Your Resume
        </button>
    </div>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) { setLoading(false); return; }
            try {
                const res = await axios.get(`${API}/profile`, { params: { userId } });
                setProfile(res.data);
            } catch (err) {
                if (err.response?.status !== 404) setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="nd-section-body">
            <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-orange-500 text-5xl mb-4">progress_activity</span>
                <p className="text-gray-500 font-medium">Assembling your profile...</p>
            </div>
        </div>
    );

    const p = profile?.personal || {};

    return (
        <div className="nd-section-body space-y-8 pb-10">
            <div className="flex justify-end mb-2">
                {!loading && profile && (
                    <button
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
                        onClick={() => navigate("/advancedashboard/resume-builder")}
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit Profile
                    </button>
                )}
            </div>

            {!profile ? (
                <EmptyState navigate={navigate} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Personal Info & Skills */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Profile Identity Card */}
                        <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden shadow-sm relative pt-24 pb-8 px-6 flex flex-col items-center text-center group">
                            {/* Banner Background */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 group-hover:scale-105 transition-transform duration-500 origin-bottom"></div>

                            {/* Avatar */}
                            <div className="relative z-10 w-28 h-28 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-4 overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300">
                                {p.avatar ? (
                                    <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover bg-gray-50" />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[64px] text-gray-300">person</span>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{p.name || "Krutanic Student"}</h2>
                            {p.location && (
                                <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <span className="material-symbols-outlined text-[14px] text-gray-400">location_on</span>
                                    {p.location}
                                </p>
                            )}

                            <div className="w-full h-px bg-gray-100 my-6"></div>

                            {/* Contact Links */}
                            <div className="w-full space-y-4 text-left">
                                {p.email && (
                                    <div className="flex items-center gap-3 text-[14px] text-gray-700 font-medium p-2 hover:bg-orange-50/50 rounded-xl transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><span className="material-symbols-outlined text-[18px]">mail</span></div>
                                        <span className="truncate">{p.email}</span>
                                    </div>
                                )}
                                {p.phone && (
                                    <div className="flex items-center gap-3 text-[14px] text-gray-700 font-medium p-2 hover:bg-red-50/50 rounded-xl transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500"><span className="material-symbols-outlined text-[18px]">phone</span></div>
                                        {p.phone}
                                    </div>
                                )}
                                {p.linkedin && (
                                    <a href={p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[14px] text-gray-700 font-medium p-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group/link">
                                        <div className="w-9 h-9 rounded-full bg-blue-50 group-hover/link:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></div>
                                        <span className="truncate">{p.linkedin}</span>
                                    </a>
                                )}
                                {p.github && (
                                    <a href={p.github.startsWith("http") ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[14px] text-gray-700 font-medium p-2 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors group/link">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 group-hover/link:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"><span className="material-symbols-outlined text-[18px]">code</span></div>
                                        <span className="truncate">{p.github}</span>
                                    </a>
                                )}
                                {p.website && (
                                    <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[14px] text-gray-700 font-medium p-2 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors group/link">
                                        <div className="w-9 h-9 rounded-full bg-green-50 group-hover/link:bg-green-100 flex items-center justify-center text-green-600 transition-colors"><span className="material-symbols-outlined text-[18px]">language</span></div>
                                        <span className="truncate">{p.website}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {(profile.skills?.languages || profile.skills?.frameworks || profile.skills?.tools || profile.skills?.concepts) && (
                            <Card>
                                <SectionTitle icon="bolt" title="Technical Skills" />
                                <div className="p-6 space-y-6">
                                    {profile.skills.languages && (
                                        <div>
                                            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Languages</h4>
                                            <div className="flex flex-wrap gap-2">{profile.skills.languages.split(",").map(s => <Tag key={s} text={s.trim()} colorClass="bg-blue-50 text-blue-700 border-blue-200" />)}</div>
                                        </div>
                                    )}
                                    {profile.skills.frameworks && (
                                        <div>
                                            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Frameworks</h4>
                                            <div className="flex flex-wrap gap-2">{profile.skills.frameworks.split(",").map(s => <Tag key={s} text={s.trim()} colorClass="bg-purple-50 text-purple-700 border-purple-200" />)}</div>
                                        </div>
                                    )}
                                    {profile.skills.tools && (
                                        <div>
                                            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tools</h4>
                                            <div className="flex flex-wrap gap-2">{profile.skills.tools.split(",").map(s => <Tag key={s} text={s.trim()} colorClass="bg-gray-50 text-gray-700 border-gray-200" />)}</div>
                                        </div>
                                    )}
                                    {profile.skills.concepts && (
                                        <div>
                                            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Concepts</h4>
                                            <div className="flex flex-wrap gap-2">{profile.skills.concepts.split(",").map(s => <Tag key={s} text={s.trim()} colorClass="bg-orange-50 text-orange-700 border-orange-200" />)}</div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Experience, Education, Projects */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Experience */}
                        {profile.experience?.some(e => e.title || e.company) && (
                            <Card>
                                <SectionTitle icon="work" title="Experience" />
                                <div className="p-0">
                                    {profile.experience.filter(e => e.title || e.company).map((exp, i) => (
                                        <div key={i} className="p-6 border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">{exp.title}</h4>
                                                    <p className="text-orange-600 font-semibold text-[15px]">{exp.company}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[13px] font-medium">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                                        {[exp.start, exp.end].filter(Boolean).join(" – ")}
                                                    </div>
                                                    {exp.location && <div className="text-[13px] text-gray-500 mt-1.5 flex items-center justify-start sm:justify-end gap-1"><span className="material-symbols-outlined text-[13px]">location_on</span>{exp.location}</div>}
                                                </div>
                                            </div>
                                            <ul className="space-y-2 mt-4 text-[14px] text-gray-600">
                                                {splitLines(exp.bullets).map((b, j) => (
                                                    <li key={j} className="flex gap-3 items-start">
                                                        <span className="material-symbols-outlined text-[14px] text-orange-400 mt-0.5 shrink-0">arrow_right</span>
                                                        <span className="leading-relaxed">{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Projects */}
                        {profile.projects?.some(e => e.name) && (
                            <Card>
                                <SectionTitle icon="developer_mode" title="Projects & Portfolio" />
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profile.projects.filter(e => e.name).map((proj, i) => (
                                        <div key={i} className="bg-white border text-left border-gray-200/80 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-[16px] font-bold text-gray-900 leading-tight">{proj.name}</h4>
                                                {proj.link && (
                                                    <a href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors p-1 bg-gray-50 rounded-lg border border-gray-100">
                                                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                                    </a>
                                                )}
                                            </div>
                                            {proj.techStack && (
                                                <div className="mb-4 text-[13px] text-orange-600 font-medium bg-orange-50/50 inline-block px-2.5 py-1 rounded-md border border-orange-100/50">
                                                    {proj.techStack}
                                                </div>
                                            )}
                                            <ul className="space-y-2 text-[13.5px] text-gray-600">
                                                {splitLines(proj.bullets).map((b, j) => (
                                                    <li key={j} className="flex gap-2 items-start">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                                                        <span className="leading-relaxed">{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Education */}
                        {profile.education?.some(e => e.school || e.degree) && (
                            <Card>
                                <SectionTitle icon="school" title="Education" />
                                <div className="p-0">
                                    {profile.education.filter(e => e.school || e.degree).map((edu, i) => (
                                        <div key={i} className="p-6 border-b last:border-0 border-gray-100 flex gap-5 hover:bg-gray-50/50 transition-colors">
                                            <div className="hidden sm:flex shrink-0 w-12 h-12 bg-orange-50 rounded-xl items-center justify-center text-orange-500 border border-orange-100">
                                                <span className="material-symbols-outlined text-[24px]">account_balance</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row justify-between mb-2">
                                                    <div>
                                                        <h4 className="text-[16px] font-bold text-gray-900">{edu.school}</h4>
                                                        <p className="text-gray-600 font-medium text-[14px] mt-0.5">{edu.degree}</p>
                                                    </div>
                                                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                                        <span className="text-[13px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{[edu.start, edu.end].filter(Boolean).join(" – ")}</span>
                                                        {edu.location && <div className="text-[13px] text-gray-400 mt-1.5">{edu.location}</div>}
                                                    </div>
                                                </div>
                                                {edu.details && (
                                                    <ul className="mt-4 space-y-1.5 text-[13.5px] text-gray-500">
                                                        {splitLines(edu.details).map((d, j) => (
                                                            <li key={j} className="flex gap-2 items-start">
                                                                <span className="material-symbols-outlined text-[14px] text-orange-400 mt-0.5 shrink-0">check_circle</span>
                                                                <span>{d}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Extra */}
                        {profile.extra?.some(e => e.sectionTitle) && profile.extra.filter(e => e.sectionTitle).map((ex, i) => (
                            <Card key={`extra-${i}`}>
                                <SectionTitle icon="star" title={ex.sectionTitle} />
                                <div className="p-6 bg-white">
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[14px] text-gray-700">
                                        {splitLines(ex.items).map((item, j) => (
                                            <li key={j} className="flex gap-3 items-center p-3 bg-gray-50/80 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-orange-200 transition-all group">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                                                    <span className="material-symbols-outlined text-[16px]">military_tech</span>
                                                </div>
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        ))}

                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-[14px] font-medium flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
