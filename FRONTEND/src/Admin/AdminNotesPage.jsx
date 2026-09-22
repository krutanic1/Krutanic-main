import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import API from "../API";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const toast = (msg, type = "success") => alert(`${type === "error" ? "❌" : "✅"} ${msg}`);

const InputField = ({ label, value, onChange, placeholder, required, type = "text" }) => (
  <div className="an-field">
    <label className="an-label">{label}{required && <span className="an-req">*</span>}</label>
    <input
      className="an-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="an-field">
    <label className="an-label">{label}</label>
    <textarea
      className="an-input an-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder, required }) => (
  <div className="an-field">
    <label className="an-label">{label}{required && <span className="an-req">*</span>}</label>
    <select className="an-input an-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || "Select…"}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// ─── BOARDS TAB ───────────────────────────────────────────────────────────────
const BoardsTab = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", shortName: "", description: "", logoUrl: "", displayOrder: 0 });
  const [editId, setEditId] = useState(null);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/notes/admin/boards`);
      setBoards(res.data);
    } catch { toast("Failed to load boards", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.shortName) return toast("Name and Short Name required", "error");
    try {
      if (editId) {
        await axios.put(`${API}/api/notes/admin/boards/${editId}`, form);
        toast("Board updated!");
      } else {
        await axios.post(`${API}/api/notes/admin/boards`, form);
        toast("Board created!");
      }
      setForm({ name: "", shortName: "", description: "", logoUrl: "", displayOrder: 0 });
      setEditId(null);
      fetchBoards();
    } catch (err) {
      toast(err?.response?.data?.message || "Save failed", "error");
    }
  };

  const handleEdit = (b) => {
    setEditId(b._id);
    setForm({ name: b.name, shortName: b.shortName, description: b.description || "", logoUrl: b.logoUrl || "", displayOrder: b.displayOrder || 0 });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board? All its semesters and subjects will become orphaned.")) return;
    try {
      await axios.delete(`${API}/api/notes/admin/boards/${id}`);
      toast("Board deleted!");
      fetchBoards();
    } catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="an-tab-body">
      <div className="an-split">
        {/* Form */}
        <div className="an-card an-form-card">
          <h3 className="an-card-title">{editId ? "✏️ Edit Board" : "➕ Add New Board"}</h3>
          <form onSubmit={handleSave} className="an-form">
            <InputField label="Full Name" value={form.name} onChange={(v) => setForm(p => ({ ...p, name: v }))}
              placeholder="Visvesvaraya Technological University" required />
            <InputField label="Short Name / Abbreviation" value={form.shortName} onChange={(v) => setForm(p => ({ ...p, shortName: v.toUpperCase() }))}
              placeholder="VTU" required />
            <TextAreaField label="Description" value={form.description} onChange={(v) => setForm(p => ({ ...p, description: v }))}
              placeholder="A brief description of the board…" rows={2} />
            <InputField label="Logo URL (optional)" value={form.logoUrl} onChange={(v) => setForm(p => ({ ...p, logoUrl: v }))}
              placeholder="https://…" />
            <InputField label="Display Order" type="number" value={form.displayOrder} onChange={(v) => setForm(p => ({ ...p, displayOrder: Number(v) }))} placeholder="0" />
            <div className="an-form-actions">
              <button type="submit" className="an-btn an-btn-primary">
                {editId ? "Update Board" : "Add Board"}
              </button>
              {editId && (
                <button type="button" className="an-btn an-btn-ghost" onClick={() => { setEditId(null); setForm({ name: "", shortName: "", description: "", logoUrl: "", displayOrder: 0 }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="an-card an-list-card">
          <h3 className="an-card-title">📋 All Boards ({boards.length})</h3>
          {loading ? <div className="an-loading">Loading…</div> : (
            <div className="an-list">
              {boards.length === 0 ? <div className="an-empty">No boards yet. Add one!</div> : boards.map(b => (
                <div key={b._id} className="an-list-item">
                  <div className="an-list-icon">{b.shortName?.slice(0, 3)}</div>
                  <div className="an-list-body">
                    <p className="an-list-title">{b.shortName} — {b.name}</p>
                    {b.description && <p className="an-list-sub">{b.description}</p>}
                  </div>
                  <div className="an-list-actions">
                    <button className="an-icon-btn" onClick={() => handleEdit(b)} title="Edit">✏️</button>
                    <button className="an-icon-btn an-icon-btn-del" onClick={() => handleDelete(b._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SEMESTERS TAB ─────────────────────────────────────────────────────────────
const SemestersTab = () => {
  const [boards, setBoards] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [form, setForm] = useState({ board: "", name: "", displayOrder: 0 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/notes/admin/boards`).then(r => setBoards(r.data)).catch(() => {});
  }, []);

  const fetchSems = useCallback(async (boardId) => {
    if (!boardId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/notes/admin/semesters?boardId=${boardId}`);
      setSemesters(res.data);
    } catch { toast("Failed to load semesters", "error"); }
    finally { setLoading(false); }
  }, []);

  const handleBoardFilter = (id) => {
    setSelectedBoard(id);
    setForm(p => ({ ...p, board: id }));
    fetchSems(id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.board || !form.name) return toast("Board and Semester name required", "error");
    try {
      if (editId) {
        await axios.put(`${API}/api/notes/admin/semesters/${editId}`, form);
        toast("Semester updated!");
      } else {
        await axios.post(`${API}/api/notes/admin/semesters`, form);
        toast("Semester added!");
      }
      setEditId(null);
      setForm(p => ({ ...p, name: "", displayOrder: 0 }));
      fetchSems(selectedBoard);
    } catch (err) {
      toast(err?.response?.data?.message || "Save failed", "error");
    }
  };

  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({ board: s.board?._id || s.board, name: s.name, displayOrder: s.displayOrder || 0 });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this semester?")) return;
    try {
      await axios.delete(`${API}/api/notes/admin/semesters/${id}`);
      toast("Deleted!");
      fetchSems(selectedBoard);
    } catch { toast("Delete failed", "error"); }
  };

  const SEM_PRESETS = [
    "1st Semester", "2nd Semester", "3rd Semester", "4th Semester",
    "5th Semester", "6th Semester", "7th Semester", "8th Semester",
  ];

  return (
    <div className="an-tab-body">
      <div className="an-split">
        <div className="an-card an-form-card">
          <h3 className="an-card-title">{editId ? "✏️ Edit Semester" : "➕ Add Semester"}</h3>
          <form onSubmit={handleSave} className="an-form">
            <SelectField label="Board" value={form.board} onChange={(v) => { setForm(p => ({ ...p, board: v })); setSelectedBoard(v); fetchSems(v); }}
              options={boards.map(b => ({ value: b._id, label: `${b.shortName} – ${b.name}` }))}
              placeholder="Select board…" required />
            <div className="an-field">
              <label className="an-label">Semester Name<span className="an-req">*</span></label>
              <div className="an-presets">
                {SEM_PRESETS.map(p => (
                  <button key={p} type="button" className={`an-preset-btn ${form.name === p ? "active" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, name: p }))}>
                    {p.replace(" Semester", " Sem")}
                  </button>
                ))}
              </div>
              <input className="an-input" style={{ marginTop: 8 }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Or type custom name…" />
            </div>
            <InputField label="Display Order" type="number" value={form.displayOrder} onChange={(v) => setForm(p => ({ ...p, displayOrder: Number(v) }))} placeholder="0" />
            <div className="an-form-actions">
              <button type="submit" className="an-btn an-btn-primary">{editId ? "Update" : "Add Semester"}</button>
              {editId && <button type="button" className="an-btn an-btn-ghost" onClick={() => { setEditId(null); setForm(p => ({ ...p, name: "", displayOrder: 0 })); }}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="an-card an-list-card">
          <h3 className="an-card-title">📋 Semesters ({semesters.length})</h3>
          {selectedBoard === "" && <p className="an-hint">← Select a board on the left to view semesters.</p>}
          {loading ? <div className="an-loading">Loading…</div> : (
            <div className="an-list">
              {semesters.length === 0 && selectedBoard ? <div className="an-empty">No semesters yet.</div> : semesters.map(s => (
                <div key={s._id} className="an-list-item">
                  <div className="an-list-icon" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
                    {s.name.match(/\d+/)?.[0] || "S"}
                  </div>
                  <div className="an-list-body">
                    <p className="an-list-title">{s.name}</p>
                    <p className="an-list-sub">{s.board?.shortName || ""}</p>
                  </div>
                  <div className="an-list-actions">
                    <button className="an-icon-btn" onClick={() => handleEdit(s)}>✏️</button>
                    <button className="an-icon-btn an-icon-btn-del" onClick={() => handleDelete(s._id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SUBJECTS TAB ─────────────────────────────────────────────────────────────
const SubjectsTab = () => {
  const [boards, setBoards] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selBoard, setSelBoard] = useState("");
  const [selSem, setSelSem] = useState("");
  const [selSchema, setSelSchema] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    semester: "", schemaYear: "", subjectName: "", subjectCode: "",
    description: "", pdfDriveLink: "", thumbnailUrl: "", displayOrder: 0,
  });

  useEffect(() => {
    axios.get(`${API}/api/notes/admin/boards`).then(r => setBoards(r.data)).catch(() => {});
  }, []);

  const fetchSems = async (boardId) => {
    if (!boardId) return;
    try {
      const r = await axios.get(`${API}/api/notes/admin/semesters?boardId=${boardId}`);
      setSemesters(r.data);
    } catch { }
  };

  const fetchSubjects = useCallback(async (semId, schema) => {
    if (!semId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ semesterId: semId });
      if (schema) params.append("schema", schema);
      const res = await axios.get(`${API}/api/notes/admin/subjects?${params}`);
      setSubjects(res.data);
    } catch { toast("Failed to load subjects", "error"); }
    finally { setLoading(false); }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const { semester, schemaYear, subjectName, pdfDriveLink } = form;
    if (!semester || !schemaYear || !subjectName || !pdfDriveLink)
      return toast("Semester, Schema Year, Subject Name and PDF Link are required", "error");
    try {
      if (editId) {
        await axios.put(`${API}/api/notes/admin/subjects/${editId}`, form);
        toast("Subject updated!");
      } else {
        await axios.post(`${API}/api/notes/admin/subjects`, form);
        toast("Subject added!");
      }
      setEditId(null);
      setForm(p => ({ ...p, subjectName: "", subjectCode: "", description: "", pdfDriveLink: "", thumbnailUrl: "", displayOrder: 0 }));
      fetchSubjects(selSem, selSchema);
    } catch (err) {
      toast(err?.response?.data?.message || "Save failed", "error");
    }
  };

  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({
      semester: s.semester?._id || s.semester,
      schemaYear: s.schemaYear,
      subjectName: s.subjectName,
      subjectCode: s.subjectCode || "",
      description: s.description || "",
      pdfDriveLink: s.pdfDriveLink,
      thumbnailUrl: s.thumbnailUrl || "",
      displayOrder: s.displayOrder || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await axios.delete(`${API}/api/notes/admin/subjects/${id}`);
      toast("Deleted!");
      fetchSubjects(selSem, selSchema);
    } catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="an-tab-body">
      {/* Drill-down filters */}
      <div className="an-card an-filter-card">
        <div className="an-filter-row">
          <SelectField label="Board" value={selBoard}
            onChange={(v) => { setSelBoard(v); setSelSem(""); setSemesters([]); setSubjects([]); fetchSems(v); }}
            options={boards.map(b => ({ value: b._id, label: b.shortName }))} placeholder="All Boards" />
          <SelectField label="Semester" value={selSem}
            onChange={(v) => { setSelSem(v); setForm(p => ({ ...p, semester: v })); setSubjects([]); fetchSubjects(v, selSchema); }}
            options={semesters.map(s => ({ value: s._id, label: s.name }))} placeholder="All Semesters" />
          <InputField label="Schema Year" value={selSchema}
            onChange={(v) => { setSelSchema(v); setForm(p => ({ ...p, schemaYear: v })); if (selSem) fetchSubjects(selSem, v); }}
            placeholder="e.g. 2022" />
        </div>
      </div>

      <div className="an-split">
        {/* Form */}
        <div className="an-card an-form-card">
          <h3 className="an-card-title">{editId ? "✏️ Edit Subject" : "➕ Add Subject"}</h3>
          <form onSubmit={handleSave} className="an-form">
            <SelectField label="Semester" value={form.semester}
              onChange={(v) => setForm(p => ({ ...p, semester: v }))}
              options={semesters.map(s => ({ value: s._id, label: s.name }))}
              placeholder="Select semester…" required />
            <InputField label="Schema / Year" value={form.schemaYear}
              onChange={(v) => setForm(p => ({ ...p, schemaYear: v }))}
              placeholder="e.g. 2022, 2023" required />
            <InputField label="Subject Name" value={form.subjectName}
              onChange={(v) => setForm(p => ({ ...p, subjectName: v }))}
              placeholder="Mathematics – I" required />
            <InputField label="Subject Code (optional)" value={form.subjectCode}
              onChange={(v) => setForm(p => ({ ...p, subjectCode: v }))}
              placeholder="21MAT11" />
            <TextAreaField label="Description (optional)" value={form.description}
              onChange={(v) => setForm(p => ({ ...p, description: v }))}
              placeholder="Brief description of the subject…" rows={2} />
            <div className="an-field">
              <label className="an-label">PDF Drive Link<span className="an-req">*</span></label>
              <input className="an-input" value={form.pdfDriveLink}
                onChange={(e) => setForm(p => ({ ...p, pdfDriveLink: e.target.value }))}
                placeholder="https://drive.google.com/file/d/…/view" required />
              <p className="an-hint">Paste the Google Drive share link for the PDF notes.</p>
            </div>
            <InputField label="Display Order" type="number" value={form.displayOrder}
              onChange={(v) => setForm(p => ({ ...p, displayOrder: Number(v) }))} placeholder="0" />
            <div className="an-form-actions">
              <button type="submit" className="an-btn an-btn-primary">{editId ? "Update Subject" : "Add Subject"}</button>
              {editId && (
                <button type="button" className="an-btn an-btn-ghost"
                  onClick={() => { setEditId(null); setForm(p => ({ ...p, subjectName: "", subjectCode: "", description: "", pdfDriveLink: "", thumbnailUrl: "", displayOrder: 0 })); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="an-card an-list-card">
          <h3 className="an-card-title">📚 Subjects ({subjects.length})</h3>
          {!selSem && <p className="an-hint">← Select a board and semester to view subjects.</p>}
          {loading ? <div className="an-loading">Loading…</div> : (
            <div className="an-list">
              {subjects.length === 0 && selSem ? <div className="an-empty">No subjects yet for this selection.</div> : subjects.map(s => (
                <div key={s._id} className="an-list-item">
                  <div className="an-list-icon" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", fontSize: 11 }}>
                    {s.schemaYear}
                  </div>
                  <div className="an-list-body">
                    <p className="an-list-title">{s.subjectName} {s.subjectCode && <span className="an-code-badge">{s.subjectCode}</span>}</p>
                    <p className="an-list-sub">
                      <a href={s.pdfDriveLink} target="_blank" rel="noopener noreferrer" className="an-pdf-link">
                        📄 View PDF
                      </a>
                    </p>
                  </div>
                  <div className="an-list-actions">
                    <button className="an-icon-btn" onClick={() => handleEdit(s)}>✏️</button>
                    <button className="an-icon-btn an-icon-btn-del" onClick={() => handleDelete(s._id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
const AdminNotesPage = () => {
  const [tab, setTab] = useState("boards");
  const TABS = [
    { key: "boards", label: "🏛️ Boards" },
    { key: "semesters", label: "📅 Semesters" },
    { key: "subjects", label: "📚 Subjects & PDFs" },
  ];

  return (
    <>
      <style>{adminNotesStyles}</style>
      <div id="AdminAddCourse" className="an-page">
        <div className="an-page-header">
          <div>
            <h1 className="an-page-title">Notes Hub — Admin</h1>
            <p className="an-page-sub">Manage education boards, semesters, schema years, and subject PDF links.</p>
          </div>
          <a href="/notes" target="_blank" className="an-preview-link">
            👁️ Preview /notes
          </a>
        </div>

        {/* Tabs */}
        <div className="an-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`an-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "boards" && <BoardsTab />}
        {tab === "semesters" && <SemestersTab />}
        {tab === "subjects" && <SubjectsTab />}
      </div>
    </>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const adminNotesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .an-page {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'Inter', sans-serif;
    padding: 32px 24px 80px;
  }
  .an-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .an-page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 4px;
  }
  .an-page-sub {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  .an-preview-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .an-preview-link:hover { filter: brightness(1.1); transform: translateY(-1px); }

  /* Tabs */
  .an-tabs {
    display: flex;
    gap: 4px;
    background: #e2e8f0;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
    width: fit-content;
    flex-wrap: wrap;
  }
  .an-tab {
    padding: 10px 20px;
    border-radius: 9px;
    border: none;
    background: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .an-tab.active {
    background: #fff;
    color: #6d28d9;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .an-tab:not(.active):hover { color: #334155; }

  /* Layout */
  .an-tab-body {}
  .an-split {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .an-split { grid-template-columns: 1fr; }
  }

  /* Card */
  .an-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .an-filter-card {
    margin-bottom: 20px;
    padding: 20px 24px;
  }
  .an-filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    align-items: end;
  }
  .an-card-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px;
  }

  /* Form */
  .an-form { display: flex; flex-direction: column; gap: 14px; }
  .an-field { display: flex; flex-direction: column; gap: 5px; }
  .an-label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
  .an-req { color: #ef4444; margin-left: 3px; }
  .an-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #1e293b;
    background: #fff;
    outline: none;
    transition: border-color 0.18s;
    box-sizing: border-box;
  }
  .an-input:focus { border-color: #7c3aed; }
  .an-textarea { resize: vertical; min-height: 70px; }
  .an-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  .an-hint {
    font-size: 12px;
    color: #94a3b8;
    margin: 4px 0 0;
  }
  .an-form-actions {
    display: flex;
    gap: 10px;
    padding-top: 4px;
  }
  .an-btn {
    padding: 11px 22px;
    border-radius: 10px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
  }
  .an-btn-primary {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 12px rgba(124,58,237,0.3);
  }
  .an-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .an-btn-ghost {
    background: #f1f5f9;
    color: #475569;
  }
  .an-btn-ghost:hover { background: #e2e8f0; }

  /* Presets */
  .an-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .an-preset-btn {
    padding: 5px 12px;
    border-radius: 7px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    color: #475569;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .an-preset-btn.active,
  .an-preset-btn:hover {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    border-color: #a78bfa;
    color: #6d28d9;
  }

  /* List */
  .an-list { display: flex; flex-direction: column; gap: 10px; }
  .an-loading {
    text-align: center;
    color: #94a3b8;
    padding: 40px;
    font-size: 14px;
  }
  .an-empty {
    text-align: center;
    color: #94a3b8;
    padding: 40px 20px;
    font-size: 14px;
  }
  .an-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #f1f5f9;
    background: #fafbfc;
    transition: all 0.15s;
  }
  .an-list-item:hover { border-color: #e0e7ff; background: #f5f3ff; }
  .an-list-icon {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    font-weight: 800;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.5px;
    text-align: center;
  }
  .an-list-body { flex: 1; min-width: 0; }
  .an-list-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .an-list-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
  }
  .an-list-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  .an-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .an-icon-btn:hover { background: #ede9fe; border-color: #a78bfa; transform: scale(1.05); }
  .an-icon-btn-del:hover { background: #fef2f2; border-color: #fca5a5; }
  .an-code-badge {
    display: inline-block;
    background: #ede9fe;
    color: #6d28d9;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 5px;
    margin-left: 6px;
    letter-spacing: 0.05em;
  }
  .an-pdf-link {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    font-size: 12px;
  }
  .an-pdf-link:hover { text-decoration: underline; }
`;

export default AdminNotesPage;
