import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import API from "../../API";
import { SectionHeader } from "../new-dashboad";

/* ─────────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────────── */
const initialState = {
    personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "", avatar: "" },
    education: [{ id: 1, school: "", degree: "", location: "", start: "", end: "", details: "" }],
    experience: [{ id: 1, title: "", company: "", location: "", start: "", end: "", bullets: "" }],
    projects: [{ id: 1, name: "", techStack: "", link: "", bullets: "" }],
    skills: { languages: "", frameworks: "", tools: "", concepts: "" },
    extra: [{ id: 1, sectionTitle: "", items: "" }],
};

const STEPS = [
    { key: "personal", label: "Personal Info", icon: "person" },
    { key: "education", label: "Education", icon: "school" },
    { key: "experience", label: "Experience", icon: "work" },
    { key: "projects", label: "Projects", icon: "code" },
    { key: "skills", label: "Skills", icon: "build" },
    { key: "extra", label: "Extra", icon: "star" },
];

let nextId = 100;

const splitLines = (text) => text ? text.split("\n").map(l => l.trim()).filter(Boolean) : [];

/* ─────────────────────────────────────────────
   BUILD CLEAN HTML STRING
   ⚠ NO auto-print, NO complex CSS, NO borders on container.
   Chrome renders this as real vector text → selectable PDF.
───────────────────────────────────────────── */
const buildResumeInner = (data) => {
    const { personal: p, education, experience, projects, skills, extra } = data;
    const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean);

    const sec = (title, rows) => rows ? `<div class="rp-sec"><div class="rp-sectitle">${title}</div>${rows}</div>` : "";

    const eduRows = education.filter(e => e.school || e.degree).map(edu => {
        const lines = splitLines(edu.details).map(d => `<div class="rp-bul">&bull; ${d}</div>`).join("");
        return `<div class="rp-ent"><div class="rp-row"><b>${edu.school || ""}</b><span>${[edu.start, edu.end].filter(Boolean).join(" \u2013 ")}</span></div><div class="rp-row"><i>${edu.degree || ""}</i><span>${edu.location || ""}</span></div>${lines}</div>`;
    }).join("");

    const expRows = experience.filter(e => e.title || e.company).map(exp => {
        const bullets = splitLines(exp.bullets).map(b => `<div class="rp-bul">&bull; ${b}</div>`).join("");
        return `<div class="rp-ent"><div class="rp-row"><b>${exp.title || ""}${exp.company ? " \u2013 " + exp.company : ""}</b><span>${[exp.start, exp.end].filter(Boolean).join(" \u2013 ")}</span></div>${exp.location ? `<div><i>${exp.location}</i></div>` : ""}${bullets}</div>`;
    }).join("");

    const projRows = projects.filter(e => e.name).map(proj => {
        const bullets = splitLines(proj.bullets).map(b => `<div class="rp-bul">&bull; ${b}</div>`).join("");
        return `<div class="rp-ent"><div class="rp-row"><span><b>${proj.name}</b>${proj.techStack ? " | <i>" + proj.techStack + "</i>" : ""}</span><span>${proj.link || ""}</span></div>${bullets}</div>`;
    }).join("");

    const skillRows = [
        skills.languages ? `<div class="rp-skrow"><b>Languages:</b>&nbsp;${skills.languages}</div>` : "",
        skills.frameworks ? `<div class="rp-skrow"><b>Frameworks:</b>&nbsp;${skills.frameworks}</div>` : "",
        skills.tools ? `<div class="rp-skrow"><b>Tools:</b>&nbsp;${skills.tools}</div>` : "",
        skills.concepts ? `<div class="rp-skrow"><b>Concepts:</b>&nbsp;${skills.concepts}</div>` : "",
    ].join("");

    const extraSecs = extra.filter(e => e.sectionTitle).map(ex =>
        sec(ex.sectionTitle, splitLines(ex.items).map(item => `<div class="rp-bul">&bull; ${item}</div>`).join(""))
    ).join("");

    return (
        `${p.name ? `<h2 class="rp-name">${p.name}</h2>` : ""}`
        + `${contactParts.length > 0 ? `<div class="rp-contact">${contactParts.join(" | ")}</div>` : ""}`
        + sec("Education", eduRows)
        + sec("Experience", expRows)
        + sec("Projects", projRows)
        + (skillRows ? sec("Technical Skills", skillRows) : "")
        + extraSecs
    );
};

/* ─────────────────────────────────────────────
   FORM SECTIONS
───────────────────────────────────────────── */
const Field = ({ label, value, onChange, placeholder, type = "text", required }) => (
    <div className="rb-field">
        <label className="rb-label">{label}{required && <span className="rb-required"> *</span>}</label>
        <input
            type={type}
            className="rb-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || label}
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, hint }) => (
    <div className="rb-field">
        <label className="rb-label">{label}</label>
        {hint && <p className="rb-hint">{hint}</p>}
        <textarea
            className="rb-textarea"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
        />
    </div>
);

const PersonalForm = ({ data, onChange, showAvatar }) => (
    <div className="rb-form-section">
        <div className="rb-form-row">
            <Field label="Full Name" value={data.name} onChange={v => onChange("name", v)} placeholder="e.g. John Doe" required />
            <Field label="Email" value={data.email} onChange={v => onChange("email", v)} placeholder="john@example.com" type="email" required />
        </div>
        <div className="rb-form-row">
            <Field label="Phone" value={data.phone} onChange={v => onChange("phone", v)} placeholder="+91 9876543210" />
            <Field label="Location" value={data.location} onChange={v => onChange("location", v)} placeholder="e.g. Bangalore, India" />
        </div>
        <div className="rb-form-row">
            <Field label="LinkedIn URL" value={data.linkedin} onChange={v => onChange("linkedin", v)} placeholder="linkedin.com/in/username" />
            <Field label="GitHub URL" value={data.github} onChange={v => onChange("github", v)} placeholder="github.com/username" />
        </div>
        <Field label="Portfolio / Website" value={data.website} onChange={v => onChange("website", v)} placeholder="yoursite.dev" />
        {showAvatar && (
            <div className="rb-field mt-6">
                <label className="rb-label mb-3 block">Choose Avatar</label>
                <div className="flex flex-wrap gap-4">
                    {[
                        "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
                        "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka",
                        "https://api.dicebear.com/7.x/notionists/svg?seed=Mimi",
                        "https://api.dicebear.com/7.x/notionists/svg?seed=Jack",
                        "https://api.dicebear.com/7.x/notionists/svg?seed=Luna"
                    ].map((url, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange("avatar", url)}
                            className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all duration-200 ${data.avatar === url ? "border-orange-500 scale-110 shadow-md" : "border-gray-100 hover:border-gray-300"}`}
                            title={`Select Avatar ${i + 1}`}
                        >
                            <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover bg-gray-50" />
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const EducationForm = ({ data, onChange, onAdd, onRemove }) => (
    <div className="rb-form-section">
        {data.map((edu, i) => (
            <div key={edu.id} className="rb-entry-card">
                <div className="rb-entry-header">
                    <span className="rb-entry-num">Education #{i + 1}</span>
                    {data.length > 1 && (
                        <button className="rb-remove-btn" onClick={() => onRemove(edu.id)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span> Remove
                        </button>
                    )}
                </div>
                <div className="rb-form-row">
                    <Field label="School / University" value={edu.school} onChange={v => onChange(edu.id, "school", v)} placeholder="e.g. VIT University" required />
                    <Field label="Degree" value={edu.degree} onChange={v => onChange(edu.id, "degree", v)} placeholder="e.g. B.Tech Computer Science" required />
                </div>
                <div className="rb-form-row">
                    <Field label="Location" value={edu.location} onChange={v => onChange(edu.id, "location", v)} placeholder="Chennai, India" />
                    <Field label="Start" value={edu.start} onChange={v => onChange(edu.id, "start", v)} placeholder="Aug 2020" />
                    <Field label="End" value={edu.end} onChange={v => onChange(edu.id, "end", v)} placeholder="May 2024 or Present" />
                </div>
                <TextArea label="Details (optional)" value={edu.details} onChange={v => onChange(edu.id, "details", v)}
                    placeholder="e.g. GPA: 8.5/10, Dean's List, etc." hint="One item per line" />
            </div>
        ))}
        <button className="rb-add-btn" onClick={onAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Education
        </button>
    </div>
);

const ExperienceForm = ({ data, onChange, onAdd, onRemove }) => (
    <div className="rb-form-section">
        {data.map((exp, i) => (
            <div key={exp.id} className="rb-entry-card">
                <div className="rb-entry-header">
                    <span className="rb-entry-num">Experience #{i + 1}</span>
                    {data.length > 1 && (
                        <button className="rb-remove-btn" onClick={() => onRemove(exp.id)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span> Remove
                        </button>
                    )}
                </div>
                <div className="rb-form-row">
                    <Field label="Job Title" value={exp.title} onChange={v => onChange(exp.id, "title", v)} placeholder="e.g. Software Engineer Intern" required />
                    <Field label="Company" value={exp.company} onChange={v => onChange(exp.id, "company", v)} placeholder="e.g. Google" required />
                </div>
                <div className="rb-form-row">
                    <Field label="Location" value={exp.location} onChange={v => onChange(exp.id, "location", v)} placeholder="Remote / Bangalore" />
                    <Field label="Start" value={exp.start} onChange={v => onChange(exp.id, "start", v)} placeholder="Jun 2023" />
                    <Field label="End" value={exp.end} onChange={v => onChange(exp.id, "end", v)} placeholder="Aug 2023 or Present" />
                </div>
                <TextArea label="Bullet Points" value={exp.bullets} onChange={v => onChange(exp.id, "bullets", v)}
                    placeholder={"Built REST APIs reducing latency by 30%\nCollaborated with cross-functional team of 8"}
                    hint="One bullet per line. Start with a strong verb. Include numbers!" />
            </div>
        ))}
        <button className="rb-add-btn" onClick={onAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Experience
        </button>
    </div>
);

const ProjectsForm = ({ data, onChange, onAdd, onRemove }) => (
    <div className="rb-form-section">
        {data.map((proj, i) => (
            <div key={proj.id} className="rb-entry-card">
                <div className="rb-entry-header">
                    <span className="rb-entry-num">Project #{i + 1}</span>
                    {data.length > 1 && (
                        <button className="rb-remove-btn" onClick={() => onRemove(proj.id)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span> Remove
                        </button>
                    )}
                </div>
                <div className="rb-form-row">
                    <Field label="Project Name" value={proj.name} onChange={v => onChange(proj.id, "name", v)} placeholder="e.g. E-Commerce Platform" required />
                    <Field label="Link" value={proj.link} onChange={v => onChange(proj.id, "link", v)} placeholder="github.com/user/repo" />
                </div>
                <Field label="Tech Stack" value={proj.techStack} onChange={v => onChange(proj.id, "techStack", v)} placeholder="React, Node.js, MongoDB" />
                <TextArea label="Bullet Points" value={proj.bullets} onChange={v => onChange(proj.id, "bullets", v)}
                    placeholder={"Developed full-stack app serving 500+ users\nImplemented JWT authentication"}
                    hint="One bullet per line." />
            </div>
        ))}
        <button className="rb-add-btn" onClick={onAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Project
        </button>
    </div>
);

const SkillsForm = ({ data, onChange }) => (
    <div className="rb-form-section">
        <p className="rb-hint rb-hint-top">Separate with commas. Example: <em>React, Next.js, Node.js</em></p>
        <Field label="Languages" value={data.languages} onChange={v => onChange("languages", v)} placeholder="JavaScript, Python, Java, C++" />
        <Field label="Frameworks & Libraries" value={data.frameworks} onChange={v => onChange("frameworks", v)} placeholder="React, Next.js, Node.js, Express" />
        <Field label="Tools & Platforms" value={data.tools} onChange={v => onChange("tools", v)} placeholder="Git, Docker, AWS, Figma, Postman" />
        <Field label="Concepts" value={data.concepts} onChange={v => onChange("concepts", v)} placeholder="REST APIs, Agile, CI/CD, OOP" />
    </div>
);

const ExtraForm = ({ data, onChange, onAdd, onRemove }) => (
    <div className="rb-form-section">
        <p className="rb-hint rb-hint-top">Certifications, Achievements, Hackathons, etc.</p>
        {data.map((ex, i) => (
            <div key={ex.id} className="rb-entry-card">
                <div className="rb-entry-header">
                    <span className="rb-entry-num">Section #{i + 1}</span>
                    {data.length > 1 && (
                        <button className="rb-remove-btn" onClick={() => onRemove(ex.id)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span> Remove
                        </button>
                    )}
                </div>
                <Field label="Section Title" value={ex.sectionTitle} onChange={v => onChange(ex.id, "sectionTitle", v)} placeholder="e.g. Certifications" required />
                <TextArea label="Items" value={ex.items} onChange={v => onChange(ex.id, "items", v)}
                    placeholder={"AWS Certified Developer (2024)\nGoogle Data Analytics Certificate"}
                    hint="One item per line." />
            </div>
        ))}
        <button className="rb-add-btn" onClick={onAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Section
        </button>
    </div>
);

/* ─────────────────────────────────────────────
   LIVE PREVIEW (in-page display only)
───────────────────────────────────────────── */
const Preview = ({ data }) => {
    const { personal: p, education, experience, projects, skills, extra } = data;
    const hasEdu = education.some(e => e.school || e.degree);
    const hasExp = experience.some(e => e.title || e.company);
    const hasProj = projects.some(e => e.name);
    const hasSkills = skills.languages || skills.frameworks || skills.tools || skills.concepts;
    const hasExtra = extra.some(e => e.sectionTitle);
    const contactParts = [p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean);

    return (
        <div className="rb-preview-paper">
            {p.name && <h1 className="rv-name">{p.name}</h1>}
            {(p.email || contactParts.length > 0) && (
                <div className="rv-contact">{[p.email, ...contactParts].filter(Boolean).join(" | ")}</div>
            )}
            {hasEdu && (
                <div className="rv-section">
                    <div className="rv-section-title">Education</div>
                    {education.map(edu => (edu.school || edu.degree) ? (
                        <div key={edu.id} className="rv-entry">
                            <div className="rv-entry-top">
                                <span className="rv-bold">{edu.school}</span>
                                <span className="rv-date">{[edu.start, edu.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            <div className="rv-entry-top">
                                <span className="rv-italic">{edu.degree}</span>
                                {edu.location && <span className="rv-location">{edu.location}</span>}
                            </div>
                            {splitLines(edu.details).map((d, i) => <div key={i} className="rv-bullet">• {d}</div>)}
                        </div>
                    ) : null)}
                </div>
            )}
            {hasExp && (
                <div className="rv-section">
                    <div className="rv-section-title">Experience</div>
                    {experience.map(exp => (exp.title || exp.company) ? (
                        <div key={exp.id} className="rv-entry">
                            <div className="rv-entry-top">
                                <span className="rv-bold">{exp.title}{exp.company ? ` – ${exp.company}` : ""}</span>
                                <span className="rv-date">{[exp.start, exp.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            {exp.location && <div className="rv-italic">{exp.location}</div>}
                            {splitLines(exp.bullets).map((b, i) => <div key={i} className="rv-bullet">• {b}</div>)}
                        </div>
                    ) : null)}
                </div>
            )}
            {hasProj && (
                <div className="rv-section">
                    <div className="rv-section-title">Projects</div>
                    {projects.map(proj => proj.name ? (
                        <div key={proj.id} className="rv-entry">
                            <div className="rv-entry-top">
                                <span><span className="rv-bold">{proj.name}</span>{proj.techStack && <span className="rv-italic"> | {proj.techStack}</span>}</span>
                                {proj.link && <span className="rv-link">{proj.link}</span>}
                            </div>
                            {splitLines(proj.bullets).map((b, i) => <div key={i} className="rv-bullet">• {b}</div>)}
                        </div>
                    ) : null)}
                </div>
            )}
            {hasSkills && (
                <div className="rv-section">
                    <div className="rv-section-title">Technical Skills</div>
                    <div className="rv-skills-table">
                        {skills.languages && <div className="rv-skill-row"><span className="rv-skill-cat">Languages:</span><span>{skills.languages}</span></div>}
                        {skills.frameworks && <div className="rv-skill-row"><span className="rv-skill-cat">Frameworks:</span><span>{skills.frameworks}</span></div>}
                        {skills.tools && <div className="rv-skill-row"><span className="rv-skill-cat">Tools:</span><span>{skills.tools}</span></div>}
                        {skills.concepts && <div className="rv-skill-row"><span className="rv-skill-cat">Concepts:</span><span>{skills.concepts}</span></div>}
                    </div>
                </div>
            )}
            {hasExtra && extra.map(ex => ex.sectionTitle ? (
                <div key={ex.id} className="rv-section">
                    <div className="rv-section-title">{ex.sectionTitle}</div>
                    {splitLines(ex.items).map((item, i) => <div key={i} className="rv-bullet">• {item}</div>)}
                </div>
            ) : null)}
            {!p.name && !hasEdu && !hasExp && !hasProj && !hasSkills && (
                <div className="rv-empty-state">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#ccc" }}>edit_document</span>
                    <p>Start filling in the form to see your resume preview here.</p>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ResumeBuilderPage = () => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState(initialState);
    const previewRef = useRef(null);
    const location = useLocation();
    const isAdvancedDashboard = location.pathname.toLowerCase().startsWith("/advancedashboard");

    const updatePersonal = (field, val) => setData(d => ({ ...d, personal: { ...d.personal, [field]: val } }));
    const makeUpdater = (section) => (id, field, val) =>
        setData(d => ({ ...d, [section]: d[section].map(e => e.id === id ? { ...e, [field]: val } : e) }));
    const makeAdder = (section, blank) => () =>
        setData(d => ({ ...d, [section]: [...d[section], { ...blank, id: ++nextId }] }));
    const makeRemover = (section) => (id) =>
        setData(d => ({ ...d, [section]: d[section].filter(e => e.id !== id) }));
    const updateSkills = (field, val) => setData(d => ({ ...d, skills: { ...d.skills, [field]: val } }));

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            try {
                const res = await axios.get(`${API}/profile`, {
                    params: { userId },
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.data) {
                    const d = res.data;
                    setData({
                        personal: d.personal || initialState.personal,
                        education: d.education?.length ? d.education : initialState.education,
                        experience: d.experience?.length ? d.experience : initialState.experience,
                        projects: d.projects?.length ? d.projects : initialState.projects,
                        skills: d.skills || initialState.skills,
                        extra: d.extra?.length ? d.extra : initialState.extra,
                    });
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        try {
            await axios.post(`${API}/profile`, {
                userId,
                email: data.personal.email,
                ...data
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("Profile saved successfully!");
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile.");
        }
    };

    /* ── Print: inject resume into page, print only that div, then clean up ── */
    const handleDownload = async () => {
        // Remove any leftover print elements
        document.getElementById("rb-print-root")?.remove();
        document.getElementById("rb-print-css")?.remove();

        // Inject print-only CSS that hides everything except our resume div
        const style = document.createElement("style");
        style.id = "rb-print-css";
        style.textContent = `
            @media print {
                body > *:not(#rb-print-root) { display: none !important; }
                /* @page margin 0 removes Chrome's date/title/URL/page-number headers+footers */
                @page { margin: 0 !important; size: A4; }
                #rb-print-root {
                    display: block !important;
                    position: fixed !important;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: white;
                    z-index: 99999;
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 11pt;
                    color: #000;
                    /* Padding replaces @page margin so content has proper whitespace */
                    padding: 0.65in 0.75in;
                    line-height: 1.45;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                .rp-name { font-size: 22pt; font-weight: 700; text-align: center; margin: 0 0 4px; }
                .rp-contact { text-align: center; font-size: 9.5pt; margin-bottom: 12px; }
                .rp-sec { margin-top: 10px; }
                .rp-sectitle { font-size: 10.5pt; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.07em; border-bottom: 1.5px solid #000;
                    padding-bottom: 1px; margin-bottom: 6px; }
                .rp-ent { margin-bottom: 7px; }
                .rp-row { display: flex; justify-content: space-between; align-items: baseline;
                    flex-wrap: wrap; gap: 6px; }
                .rp-bul { margin-left: 14px; font-size: 9.5pt; margin-top: 1px; }
                .rp-skrow { font-size: 9.5pt; margin-bottom: 2px; }
            }
        `;
        document.head.appendChild(style);

        // Inject the resume HTML into a hidden div
        const div = document.createElement("div");
        div.id = "rb-print-root";
        div.style.cssText = "display:none;";
        div.innerHTML = buildResumeInner(data);
        document.body.appendChild(div);

        // Clean up after print dialog closes
        const cleanup = () => {
            div.remove();
            style.remove();
            window.removeEventListener("afterprint", cleanup);
        };
        window.addEventListener("afterprint", cleanup);

        window.print();
    };

    const handleReset = () => {
        if (window.confirm("Reset all fields? This cannot be undone.")) {
            setData(initialState);
            setStep(0);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0: return <PersonalForm data={data.personal} onChange={updatePersonal} showAvatar={isAdvancedDashboard} />;
            case 1: return <EducationForm data={data.education} onChange={makeUpdater("education")}
                onAdd={makeAdder("education", { school: "", degree: "", location: "", start: "", end: "", details: "" })}
                onRemove={makeRemover("education")} />;
            case 2: return <ExperienceForm data={data.experience} onChange={makeUpdater("experience")}
                onAdd={makeAdder("experience", { title: "", company: "", location: "", start: "", end: "", bullets: "" })}
                onRemove={makeRemover("experience")} />;
            case 3: return <ProjectsForm data={data.projects} onChange={makeUpdater("projects")}
                onAdd={makeAdder("projects", { name: "", techStack: "", link: "", bullets: "" })}
                onRemove={makeRemover("projects")} />;
            case 4: return <SkillsForm data={data.skills} onChange={updateSkills} />;
            case 5: return <ExtraForm data={data.extra} onChange={makeUpdater("extra")}
                onAdd={makeAdder("extra", { sectionTitle: "", items: "" })}
                onRemove={makeRemover("extra")} />;
            default: return null;
        }
    };

    return (
        <div className="nd-section-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <SectionHeader icon="edit_document" title="Resume Builder" subtitle="Build a clean, ATS-friendly resume step by step" />
                <a
                    href="https://drive.google.com/file/d/1HlgDf4CfQwAOm47WKA4XI2afem03fcsY/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-100 transition-all shadow-sm shrink-0"
                >
                    <span className="material-symbols-outlined text-[18px]">library_books</span>
                    Resume Data Book
                </a>
            </div>

            <div className="rb-root">
                {/* LEFT — Form */}
                <div className="rb-left">
                    <div className="rb-steps">
                        {STEPS.map((s, i) => (
                            <button key={s.key}
                                className={`rb-step-btn ${i === step ? "rb-step-active" : ""} ${i < step ? "rb-step-done" : ""}`}
                                onClick={() => setStep(i)} title={s.label}>
                                <span className="material-symbols-outlined rb-step-icon">{i < step ? "check_circle" : s.icon}</span>
                                <span className="rb-step-label">{s.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="rb-step-heading">
                        <span className="material-symbols-outlined" style={{ color: "var(--nd-primary)", fontSize: 20 }}>{STEPS[step].icon}</span>
                        <h3 className="rb-step-title">{STEPS[step].label}</h3>
                    </div>

                    <div className="rb-form-body">{renderStep()}</div>

                    <div className="rb-nav-btns">
                        <button className="rb-nav-btn rb-nav-secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back
                        </button>
                        <button className="rb-nav-btn rb-nav-reset" onClick={handleReset}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span> Reset
                        </button>
                        {step < STEPS.length - 1 ? (
                            <button className="rb-nav-btn rb-nav-primary" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
                                Next <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {isAdvancedDashboard && (
                                    <button className="rb-nav-btn rb-nav-primary" onClick={handleSave} style={{ background: "#4caf50", color: "#fff", border: "none" }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Save Profile
                                    </button>
                                )}
                                <button className="rb-nav-btn rb-nav-download" onClick={handleDownload}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — Live Preview */}
                <div className="rb-right" ref={previewRef}>
                    <div className="rb-preview-header">
                        <span className="rb-preview-label">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                            Live Preview
                        </span>
                        <button className="rb-download-fab" onClick={handleDownload} title="Download as PDF">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                            Download PDF
                        </button>
                    </div>
                    <Preview data={data} />
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderPage;
