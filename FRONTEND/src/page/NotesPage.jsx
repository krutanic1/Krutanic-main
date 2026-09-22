import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API from "../API";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toDrivePreview = (url = "") => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
};

// Each board gets a distinct leather book color
const BOOK_COLORS = [
  { spine: "#1a2744", label: "#c9a84c", shadow: "#0d1a33" },   // Navy
  { spine: "#6b1a1a", label: "#e8c97d", shadow: "#4a0e0e" },   // Burgundy
  { spine: "#1a3a2a", label: "#c9a84c", shadow: "#0d2219" },   // Forest Green
  { spine: "#3d2b0a", label: "#f0d080", shadow: "#281c06" },   // Brown
  { spine: "#2a1a4a", label: "#d4a8e8", shadow: "#1a0d33" },   // Deep Purple
  { spine: "#1a3a3a", label: "#a8d8d8", shadow: "#0d2626" },   // Teal
];

// ─── PDF Preview — Open Book ──────────────────────────────────────────────────
const PDFPreview = ({ subject, onClose }) => {
  const previewUrl = toDrivePreview(subject.pdfDriveLink);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="lib-overlay" onClick={onClose}>
      <div className="lib-book-modal" onClick={e => e.stopPropagation()}>
        {/* Book spine on left */}
        <div className="lib-modal-spine">
          <span className="lib-modal-spine-text">{subject.subjectName}</span>
          {subject.subjectCode && (
            <span className="lib-modal-spine-code">{subject.subjectCode}</span>
          )}
        </div>
        {/* Right page */}
        <div className="lib-modal-page">
          <div className="lib-modal-page-inner">
            <div className="lib-modal-header">
              <div className="lib-modal-stamp">STUDY NOTES</div>
              <div className="lib-modal-header-right">
                <a
                  href={subject.pdfDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lib-open-btn"
                >
                  ↗ Open Full PDF
                </a>
                <button className="lib-close-btn" onClick={onClose} aria-label="Close">✕</button>
              </div>
            </div>
            <div className="lib-modal-title-wrap">
              {subject.subjectCode && (
                <p className="lib-modal-code">{subject.subjectCode}</p>
              )}
              <h2 className="lib-modal-title">{subject.subjectName}</h2>
              {subject.description && (
                <p className="lib-modal-desc">{subject.description}</p>
              )}
              <div className="lib-divider-ornament">✦ ─────── ✦ ─────── ✦</div>
            </div>
            <div className="lib-iframe-wrap">
              <iframe
                src={previewUrl}
                title={subject.subjectName}
                className="lib-iframe"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const NotesPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [previewSubject, setPreviewSubject] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/api/notes/boards`)
      .then(r => setBoards(r.data))
      .catch(() => setError("Failed to load boards."))
      .finally(() => setLoading(false));
  }, []);

  const selectBoard = useCallback(async (board) => {
    setSelectedBoard(board); setStep(1); setLoading(true); setError("");
    try {
      const r = await axios.get(`${API}/api/notes/semesters?boardId=${board._id}`);
      setSemesters(r.data); setSelectedSem(null); setSchemas([]); setSelectedSchema(null); setSubjects([]);
    } catch { setError("Failed to load semesters."); }
    finally { setLoading(false); }
  }, []);

  const selectSem = useCallback(async (sem) => {
    setSelectedSem(sem); setStep(2); setLoading(true); setError(""); setSelectedSchema(null); setSubjects([]);
    try {
      const r = await axios.get(`${API}/api/notes/schemas?semesterId=${sem._id}`);
      setSchemas(r.data);
    } catch { setError("Failed to load schema years."); }
    finally { setLoading(false); }
  }, []);

  const selectSchema = useCallback(async (schema) => {
    setSelectedSchema(schema); setStep(3); setLoading(true); setError("");
    try {
      const r = await axios.get(`${API}/api/notes/subjects?semesterId=${selectedSem._id}&schema=${encodeURIComponent(schema)}`);
      setSubjects(r.data);
    } catch { setError("Failed to load subjects."); }
    finally { setLoading(false); }
  }, [selectedSem]);

  const goTo = (idx) => {
    if (idx === 0) { setStep(0); setSelectedBoard(null); setSelectedSem(null); setSelectedSchema(null); }
    else if (idx === 1) { setStep(1); setSelectedSem(null); setSelectedSchema(null); }
    else if (idx === 2) { setStep(2); setSelectedSchema(null); }
  };

  const ordinal = (n) => {
    const o = ["","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
    return o[n] || `${n}th`;
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Floating dust particles */}
      <div className="lib-root">


        {/* ── HERO ── */}
        <header className="lib-hero">
          <div className="lib-hero-ornament lib-orn-tl">❧</div>
          <div className="lib-hero-ornament lib-orn-tr">❧</div>
          <div className="lib-hero-inner">
            <div className="lib-hero-seal">
              <div className="lib-seal-ring">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path id="curve" fill="transparent" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                  <text className="lib-seal-text" width="500">
                    <textPath href="#curve" startOffset="50%" textAnchor="middle">
                      • KNOWLEDGE IS POWER •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="lib-seal-center">📚</div>
            </div>
            <p className="lib-hero-sub-top">— Digital Archive of University Notes —</p>
            <h1 className="lib-hero-h1">
              Engineering<br />
              <em>Notes Hub</em>
            </h1>
            <div className="lib-hero-rule">
              <span className="lib-rule-line" />
              <span className="lib-rule-ornament">✦</span>
              <span className="lib-rule-line" />
            </div>
            <p className="lib-hero-desc">
              Browse semester-wise study notes, organised by university board, semester,
              and scheme year. Curated for students, free forever.
            </p>
            {/* Stats */}
            <div className="lib-stats">
              <div className="lib-stat">
                <span className="lib-stat-n">{boards.length || "1"}+</span>
                <span className="lib-stat-l">Universities</span>
              </div>
              <span className="lib-stat-sep">✦</span>
              <div className="lib-stat">
                <span className="lib-stat-n">8</span>
                <span className="lib-stat-l">Semesters</span>
              </div>
              <span className="lib-stat-sep">✦</span>
              <div className="lib-stat">
                <span className="lib-stat-n">∞</span>
                <span className="lib-stat-l">Subjects</span>
              </div>
            </div>
          </div>
          <div className="lib-hero-ornament lib-orn-bl">❧</div>
          <div className="lib-hero-ornament lib-orn-br">❧</div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="lib-main">
          <div className="lib-container">

            {/* Breadcrumb trail */}
            {step > 0 && (
              <nav className="lib-trail">
                <span className="lib-trail-icon">📖</span>
                {[
                  { label: "Library", step: 0 },
                  selectedBoard && { label: selectedBoard.shortName, step: 1 },
                  selectedSem && { label: selectedSem.name, step: 2 },
                  selectedSchema && { label: `${selectedSchema} Scheme`, step: 3 },
                ].filter(Boolean).map((crumb, i, arr) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="lib-trail-sep">›</span>}
                    <button
                      className={`lib-trail-btn ${i === arr.length - 1 ? "lib-trail-active" : ""}`}
                      onClick={() => goTo(crumb.step)}
                      disabled={i === arr.length - 1}
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Error */}
            {error && (
              <div className="lib-error">⚠ {error}</div>
            )}

            {/* Loader — candle spinner */}
            {loading ? (
              <div className="lib-loading">
                <div className="lib-candle">
                  <div className="lib-flame" />
                  <div className="lib-wax" />
                </div>
                <p className="lib-loading-txt">Retrieving from the archives…</p>
              </div>
            ) : (
              <>
                {/* ═══════ STEP 0 — Bookshelf (Boards) ═══════ */}
                {step === 0 && (
                  <div className="lib-section lib-fade-in">
                    <div className="lib-section-head">
                      <h2 className="lib-section-title">Choose Your University</h2>
                      <p className="lib-section-sub">Select a volume from the shelf to begin exploring notes.</p>
                    </div>

                    {/* WOODEN BOOKSHELF */}
                    <div className="lib-shelf-wrap">
                      <div className="lib-shelf">
                        <div className="lib-shelf-wood lib-shelf-top" />
                        {boards.length === 0 ? (
                          <div className="lib-shelf-empty">
                            <span>📭</span>
                            <p>No volumes in the archive yet.</p>
                          </div>
                        ) : (
                          <div className="lib-books-row">
                            {boards.map((board, idx) => {
                              const col = BOOK_COLORS[idx % BOOK_COLORS.length];
                              return (
                                <button
                                  key={board._id}
                                  className="lib-book"
                                  onClick={() => selectBoard(board)}
                                  title={board.name}
                                  style={{
                                    "--bk-spine": col.spine,
                                    "--bk-label": col.label,
                                    "--bk-shadow": col.shadow,
                                  }}
                                >
                                  {/* Book 3D effect */}
                                  <div className="lib-book-cover">
                                    <div className="lib-book-top-edge" />
                                    <div className="lib-book-front">
                                      <div className="lib-book-decorline lib-bdl-t" />
                                      <div className="lib-book-decorline lib-bdl-b" />
                                      <span className="lib-book-short">{board.shortName}</span>
                                      <div className="lib-book-rule" />
                                      <span className="lib-book-subtitle">University Board</span>
                                      <div className="lib-book-emblem">✦</div>
                                    </div>
                                    <div className="lib-book-spine-side" />
                                  </div>
                                  <div className="lib-book-label">
                                    <span>{board.shortName}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <div className="lib-shelf-plank" />
                      </div>
                      {/* Shadow under shelf */}
                      <div className="lib-shelf-shadow" />
                    </div>

                    {/* Board info cards below shelf */}
                    {boards.length > 0 && (
                      <div className="lib-board-cards">
                        {boards.map((board, idx) => {
                          const col = BOOK_COLORS[idx % BOOK_COLORS.length];
                          return (
                            <button
                              key={board._id}
                              className="lib-board-card"
                              onClick={() => selectBoard(board)}
                              style={{ "--bk-spine": col.spine }}
                            >
                              <div className="lib-bc-accent" />
                              <div className="lib-bc-body">
                                <h3 className="lib-bc-short">{board.shortName}</h3>
                                <p className="lib-bc-name">{board.name}</p>
                                {board.description && (
                                  <p className="lib-bc-desc">{board.description}</p>
                                )}
                              </div>
                              <span className="lib-bc-cta">Open →</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ═══════ STEP 1 — Semester Pages ═══════ */}
                {step === 1 && (
                  <div className="lib-section lib-fade-in">
                    <div className="lib-section-head">
                      <div className="lib-chapter-tag">
                        <span className="lib-chapter-vol">{selectedBoard?.shortName}</span>
                      </div>
                      <h2 className="lib-section-title">Select a Chapter</h2>
                      <p className="lib-section-sub">Choose the semester — each chapter unlocks a set of subjects.</p>
                    </div>

                    {semesters.length === 0 ? (
                      <div className="lib-parchment-empty">
                        <p>🕯 No chapters have been added yet for this volume.</p>
                      </div>
                    ) : (
                      <div className="lib-sem-grid">
                        {semesters.map((sem) => {
                          const num = parseInt(sem.name.match(/\d+/)?.[0] || 1);
                          return (
                            <button
                              key={sem._id}
                              className="lib-sem-card"
                              onClick={() => selectSem(sem)}
                            >
                              {/* Parchment page feel */}
                              <div className="lib-sem-num-wrap">
                                <span className="lib-sem-roman">{toRoman(num)}</span>
                              </div>
                              <div className="lib-sem-body">
                                <span className="lib-sem-chapter">Chapter {num}</span>
                                <h4 className="lib-sem-name">{ordinal(num)} Semester</h4>
                                <span className="lib-sem-sub">Click to explore</span>
                              </div>
                              <div className="lib-sem-corner-fold" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ═══════ STEP 2 — Schema / Edition ═══════ */}
                {step === 2 && (
                  <div className="lib-section lib-fade-in">
                    <div className="lib-section-head">
                      <div className="lib-chapter-tag">
                        <span className="lib-chapter-vol">{selectedBoard?.shortName}</span>
                        <span className="lib-chapter-sep">·</span>
                        <span className="lib-chapter-vol">{selectedSem?.name}</span>
                      </div>
                      <h2 className="lib-section-title">Choose Edition / Scheme</h2>
                      <p className="lib-section-sub">
                        Different regulation years have different syllabi. Pick the edition that matches your university scheme.
                      </p>
                    </div>

                    {schemas.length === 0 ? (
                      <div className="lib-parchment-empty">
                        <p>🕯 No editions catalogued yet. Our librarians are working on it!</p>
                      </div>
                    ) : (
                      <div className="lib-schema-row">
                        {schemas.map((yr) => (
                          <button key={yr} className="lib-schema-card" onClick={() => selectSchema(yr)}>
                            <div className="lib-schema-seal">
                              <span className="lib-schema-yr">{yr}</span>
                              <span className="lib-schema-ed">EDITION</span>
                            </div>
                            <p className="lib-schema-lbl">Regulation Scheme</p>
                            <div className="lib-schema-ribbon">Open Volume</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ═══════ STEP 3 — Subject List ═══════ */}
                {step === 3 && (
                  <div className="lib-section lib-fade-in">
                    <div className="lib-section-head">
                      <div className="lib-chapter-tag">
                        <span className="lib-chapter-vol">{selectedBoard?.shortName}</span>
                        <span className="lib-chapter-sep">·</span>
                        <span className="lib-chapter-vol">{selectedSem?.name}</span>
                        <span className="lib-chapter-sep">·</span>
                        <span className="lib-chapter-vol">{selectedSchema} Scheme</span>
                      </div>
                      <h2 className="lib-section-title">
                        {subjects.length > 0
                          ? `${subjects.length} Subjects in the Catalogue`
                          : "Subject Catalogue"}
                      </h2>
                      <p className="lib-section-sub">
                        Click <strong>Read Notes</strong> on any subject to open the PDF preview.
                      </p>
                    </div>

                    {subjects.length === 0 ? (
                      <div className="lib-parchment-empty">
                        <p>🕯 This catalogue is empty. Notes will be added by our team shortly.</p>
                      </div>
                    ) : (
                      <div className="lib-catalogue">
                        {/* Catalogue header */}
                        <div className="lib-cat-header">
                          <span>#</span>
                          <span>Subject</span>
                          <span>Code</span>
                          <span>Action</span>
                        </div>
                        {subjects.map((s, idx) => (
                          <div
                            key={s._id}
                            className="lib-cat-row"
                            style={{ animationDelay: `${idx * 60}ms` }}
                          >
                            <span className="lib-cat-num">{String(idx + 1).padStart(2, "0")}</span>
                            <div className="lib-cat-info">
                              <span className="lib-cat-name">{s.subjectName}</span>
                              {s.description && (
                                <span className="lib-cat-desc">{s.description}</span>
                              )}
                            </div>
                            <span className="lib-cat-code">{s.subjectCode || "—"}</span>
                            <button className="lib-read-btn" onClick={() => setPreviewSubject(s)}>
                              📖 Read Notes
                            </button>
                          </div>
                        ))}
                        <div className="lib-cat-footer">
                          <span>End of Catalogue — {selectedBoard?.shortName} · {selectedSem?.name} · {selectedSchema} Scheme</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="lib-footer">
          <div className="lib-footer-rule">
            <span className="lib-rule-line" />
            <span>✦</span>
            <span className="lib-rule-line" />
          </div>
          <p className="lib-footer-txt">
            Krutanic Notes Archive · All content belongs to respective university bodies · Free to access
          </p>
        </footer>
      </div>

      {/* PDF Preview */}
      {previewSubject && (
        <PDFPreview subject={previewSubject} onClose={() => setPreviewSubject(null)} />
      )}
    </>
  );
};

// Roman numeral helper
function toRoman(n) {
  const map = [[8,"VIII"],[7,"VII"],[6,"VI"],[5,"V"],[4,"IV"],[3,"III"],[2,"II"],[1,"I"]];
  for (const [v,r] of map) { if (n >= v) return r; }
  return n;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

  /* ══ ROOT ══ */
  .lib-root {
    min-height: 100vh;
    background: #1a0f00;
    background-image:
      radial-gradient(ellipse at 30% 0%, rgba(120,60,0,0.4) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 100%, rgba(80,30,0,0.3) 0%, transparent 60%);
    color: #f5e6c8;
    position: relative;
    overflow-x: hidden;
  }

  /* ══ DUST PARTICLES ══ */
  .lib-dust { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .lib-particle {
    position: absolute;
    background: #d4af37;
    border-radius: 50%;
    animation: libFloat linear infinite;
  }
  @keyframes libFloat {
    0%   { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }

  /* ══ HERO ══ */
  .lib-hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 80px 24px 72px;
    border-bottom: 1px solid rgba(212,175,55,0.2);
    background-image:
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .lib-hero-ornament {
    position: absolute;
    font-size: 2.5rem;
    color: rgba(212,175,55,0.3);
    font-family: Georgia, serif;
    line-height: 1;
  }
  .lib-orn-tl { top: 24px; left: 28px; transform: scaleX(-1); }
  .lib-orn-tr { top: 24px; right: 28px; }
  .lib-orn-bl { bottom: 24px; left: 28px; transform: scaleY(-1) scaleX(-1); }
  .lib-orn-br { bottom: 24px; right: 28px; transform: scaleY(-1); }

  .lib-hero-inner { max-width: 720px; margin: 0 auto; }

  /* Wax seal */
  .lib-hero-seal {
    position: relative;
    width: 90px;
    height: 90px;
    margin: 0 auto 24px;
  }
  .lib-seal-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid #d4af37;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: libSealRotate 20s linear infinite;
  }
  @keyframes libSealRotate { to { transform: rotate(360deg); } }
  .lib-seal-text {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    fill: #d4af37;
    text-transform: uppercase;
  }
  .lib-seal-center {
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d1500, #4a2800);
    border: 1px solid rgba(212,175,55,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
  }
  .lib-hero-sub-top {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 15px;
    color: rgba(212,175,55,0.7);
    letter-spacing: 0.12em;
    margin: 0 0 12px;
  }
  .lib-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 900;
    color: #f5e6c8;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
    text-shadow: 0 4px 40px rgba(212,175,55,0.25);
  }
  .lib-hero-h1 em {
    font-style: italic;
    background: linear-gradient(135deg, #d4af37, #f0d080, #b8860b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lib-hero-rule {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0 auto 24px;
    max-width: 320px;
  }
  .lib-rule-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent);
  }
  .lib-rule-ornament, .lib-schema-yr+.lib-schema-ed {
    color: #d4af37;
    font-size: 14px;
  }
  .lib-hero-desc {
    font-family: 'Inter', sans-serif;
    font-size: 15.5px;
    color: rgba(245,230,200,0.6);
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto 36px;
  }

  /* Stats */
  .lib-stats {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 4px;
    padding: 18px 36px;
    background: rgba(212,175,55,0.04);
  }
  .lib-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .lib-stat-n {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #d4af37;
    line-height: 1;
  }
  .lib-stat-l {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: rgba(245,230,200,0.35);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .lib-stat-sep { color: #d4af37; font-size: 14px; opacity: 0.5; }

  /* ══ MAIN ══ */
  .lib-main {
    position: relative;
    z-index: 1;
    padding: 0 0 60px;
  }
  .lib-container {
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ══ BREADCRUMB TRAIL ══ */
  .lib-trail {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin: 32px 0 36px;
    padding: 12px 18px;
    background: rgba(212,175,55,0.04);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 4px;
    font-family: 'IM Fell English', serif;
  }
  .lib-trail-icon { font-size: 15px; margin-right: 4px; }
  .lib-trail-sep { color: rgba(212,175,55,0.4); font-size: 16px; }
  .lib-trail-btn {
    background: none; border: none;
    font-family: 'IM Fell English', serif;
    font-size: 14.5px;
    color: rgba(245,230,200,0.45);
    cursor: pointer;
    padding: 3px 8px;
    border-radius: 3px;
    transition: all 0.18s;
  }
  .lib-trail-btn:not(.lib-trail-active):hover {
    color: #d4af37;
    background: rgba(212,175,55,0.08);
  }
  .lib-trail-active { color: #f5e6c8; cursor: default; font-style: italic; }

  /* ══ ERROR ══ */
  .lib-error {
    background: rgba(180,40,40,0.12);
    border: 1px solid rgba(180,40,40,0.3);
    color: #fca5a5;
    padding: 12px 18px;
    border-radius: 4px;
    font-family: 'IM Fell English', serif;
    margin-bottom: 24px;
  }

  /* ══ CANDLE LOADER ══ */
  .lib-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 0;
    gap: 24px;
  }
  .lib-candle {
    position: relative;
    width: 24px;
  }
  .lib-flame {
    width: 14px;
    height: 20px;
    background: radial-gradient(ellipse at 50% 80%, #fff 0%, #ffd700 30%, #ff8c00 60%, transparent 100%);
    border-radius: 50% 50% 40% 40%;
    margin: 0 auto;
    animation: libFlicker 1.2s ease-in-out infinite alternate;
    filter: blur(1px);
    box-shadow: 0 0 16px 4px rgba(255,200,0,0.5);
  }
  @keyframes libFlicker {
    0% { transform: scaleX(1) scaleY(1) rotate(-1deg); opacity: 0.9; }
    100% { transform: scaleX(0.85) scaleY(1.08) rotate(1deg); opacity: 1; }
  }
  .lib-wax {
    width: 24px;
    height: 60px;
    background: linear-gradient(to bottom, #f5f0e8, #ede0c4);
    border-radius: 2px;
    margin: -2px auto 0;
    box-shadow: inset -2px 0 4px rgba(0,0,0,0.15);
  }
  .lib-loading-txt {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    color: rgba(245,230,200,0.45);
    font-size: 15px;
    margin: 0;
  }

  /* ══ SECTION ══ */
  .lib-section {}
  .lib-fade-in { animation: libFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes libFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lib-section-head {
    text-align: center;
    padding: 48px 0 40px;
    border-bottom: 1px solid rgba(212,175,55,0.12);
    margin-bottom: 40px;
  }
  .lib-chapter-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding: 5px 18px;
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 2px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #d4af37;
    background: rgba(212,175,55,0.05);
  }
  .lib-chapter-sep { opacity: 0.4; }
  .lib-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    color: #f5e6c8;
    letter-spacing: -0.01em;
    margin: 0 0 12px;
  }
  .lib-section-sub {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: rgba(245,230,200,0.45);
    line-height: 1.65;
    margin: 0;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  .lib-parchment-empty {
    text-align: center;
    padding: 60px 20px;
    font-family: 'IM Fell English', serif;
    font-style: italic;
    color: rgba(245,230,200,0.35);
    font-size: 16px;
  }

  /* ══ BOOKSHELF ══ */
  .lib-shelf-wrap {
    margin: 0 0 40px;
  }
  .lib-shelf {
    position: relative;
    padding: 20px 24px 0;
    background:
      linear-gradient(to bottom, rgba(60,30,0,0.6), rgba(40,20,0,0.8));
    border: 1px solid rgba(100,60,10,0.4);
    border-radius: 4px 4px 0 0;
  }
  .lib-shelf-wood {
    background: linear-gradient(to bottom, #5c3a1e, #3d2409);
    height: 10px;
    border-radius: 2px;
    margin-bottom: 20px;
  }
  .lib-books-row {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 0 8px;
    min-height: 180px;
    overflow-x: auto;
    padding-bottom: 0;
    justify-content: center;
    flex-wrap: wrap;
  }
  .lib-shelf-plank {
    height: 20px;
    background: linear-gradient(to bottom, #8b5e3c, #5c3a1e, #3d2409);
    border-radius: 0 0 3px 3px;
    margin: 0 -24px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
    border-top: 2px solid rgba(255,255,255,0.08);
  }
  .lib-shelf-shadow {
    height: 16px;
    background: radial-gradient(ellipse at 50% 0, rgba(0,0,0,0.5) 0%, transparent 70%);
    margin: 0 40px;
  }
  .lib-shelf-empty {
    text-align: center;
    padding: 40px;
    color: rgba(245,230,200,0.3);
    font-family: 'IM Fell English', serif;
    font-style: italic;
  }

  /* ══ BOOK SPINE 3D ══ */
  .lib-book {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    transform-origin: bottom center;
    flex-shrink: 0;
  }
  .lib-book:hover {
    transform: translateY(-16px) scale(1.04);
  }
  .lib-book-cover {
    position: relative;
    width: 90px;
    height: 160px;
    transform-style: preserve-3d;
    filter: drop-shadow(-4px 4px 12px rgba(0,0,0,0.7));
  }
  .lib-book-top-edge {
    position: absolute;
    top: -4px;
    left: 8px;
    right: 0;
    height: 8px;
    background: linear-gradient(to right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
    transform: skewX(40deg);
  }
  .lib-book-front {
    position: absolute;
    inset: 0;
    background: var(--bk-spine);
    border-radius: 0 3px 3px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 8px;
    border-left: 8px solid var(--bk-shadow);
    overflow: hidden;
    /* Leather texture */
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.015) 2px,
        rgba(255,255,255,0.015) 4px
      ),
      linear-gradient(135deg, var(--bk-spine), var(--bk-shadow));
  }
  .lib-book-front::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 12px;
    background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);
  }
  .lib-book-decorline {
    position: absolute;
    left: 14px;
    right: 6px;
    height: 1px;
    background: linear-gradient(90deg, var(--bk-label), transparent);
    opacity: 0.5;
  }
  .lib-bdl-t { top: 18px; }
  .lib-bdl-b { bottom: 18px; }
  .lib-book-short {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 900;
    color: var(--bk-label);
    text-align: center;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
    position: relative;
    z-index: 1;
  }
  .lib-book-rule {
    width: 50px;
    height: 1px;
    background: var(--bk-label);
    opacity: 0.4;
  }
  .lib-book-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 8px;
    font-weight: 600;
    color: var(--bk-label);
    text-align: center;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.7;
  }
  .lib-book-emblem {
    font-size: 16px;
    color: var(--bk-label);
    opacity: 0.5;
  }
  .lib-book-spine-side {
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 0;
    width: 8px;
    background: var(--bk-shadow);
  }
  .lib-book-label {
    margin-top: 6px;
    font-family: 'IM Fell English', serif;
    font-size: 12px;
    color: rgba(245,230,200,0.5);
    text-align: center;
  }

  /* Board info cards */
  .lib-board-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 28px;
  }
  .lib-board-card {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(245,230,200,0.03);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    text-align: left;
    transition: all 0.22s;
    overflow: hidden;
    padding: 0;
  }
  .lib-board-card:hover {
    border-color: rgba(212,175,55,0.4);
    background: rgba(212,175,55,0.06);
    transform: translateX(4px);
  }
  .lib-bc-accent {
    width: 4px;
    align-self: stretch;
    background: var(--bk-spine, #6366f1);
    flex-shrink: 0;
  }
  .lib-bc-body { flex: 1; padding: 16px 18px; }
  .lib-bc-short {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f5e6c8;
    margin: 0 0 3px;
  }
  .lib-bc-name {
    font-size: 12.5px;
    color: rgba(245,230,200,0.45);
    margin: 0 0 6px;
    line-height: 1.4;
  }
  .lib-bc-desc {
    font-size: 12px;
    color: rgba(245,230,200,0.28);
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .lib-bc-cta {
    padding: 0 18px;
    font-size: 13px;
    font-weight: 600;
    color: #d4af37;
    flex-shrink: 0;
    font-family: 'IM Fell English', serif;
    font-style: italic;
  }

  /* ══ SEMESTER CARDS (Parchment pages) ══ */
  .lib-sem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  .lib-sem-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 20px 22px 20px;
    background: linear-gradient(135deg, #f5ead5, #ede0c4, #e8d8b8);
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    text-align: left;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    border: 1px solid rgba(180,140,60,0.3);
    box-shadow:
      2px 2px 0 rgba(0,0,0,0.15),
      4px 4px 0 rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.5);
    overflow: hidden;
  }
  .lib-sem-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #8b4513, #d4af37, #8b4513);
  }
  /* Aged paper lines */
  .lib-sem-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 19px,
      rgba(139,90,60,0.08) 20px
    );
    pointer-events: none;
  }
  .lib-sem-card:hover {
    transform: translateY(-5px) rotate(0.5deg);
    box-shadow:
      4px 8px 0 rgba(0,0,0,0.2),
      8px 14px 0 rgba(0,0,0,0.1);
  }
  .lib-sem-num-wrap {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b4513, #c67c3a);
    border: 2px solid rgba(212,175,55,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    position: relative;
    z-index: 1;
  }
  .lib-sem-roman {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 700;
    color: #f0d080;
    letter-spacing: 0.02em;
  }
  .lib-sem-body { position: relative; z-index: 1; }
  .lib-sem-chapter {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: rgba(60,30,0,0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 3px;
  }
  .lib-sem-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: #2d1500;
    margin: 0 0 3px;
  }
  .lib-sem-sub {
    font-size: 11px;
    color: rgba(60,30,0,0.4);
    font-style: italic;
    font-family: 'IM Fell English', serif;
  }
  .lib-sem-corner-fold {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 22px 22px;
    border-color: transparent transparent rgba(180,140,60,0.3) transparent;
    transition: border-width 0.2s;
  }
  .lib-sem-card:hover .lib-sem-corner-fold {
    border-width: 0 0 28px 28px;
  }

  /* ══ SCHEMA YEAR CARDS ══ */
  .lib-schema-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
  }
  .lib-schema-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 36px 32px;
    background: linear-gradient(135deg, #f5ead5, #ede0c4);
    border: 1px solid rgba(180,140,60,0.4);
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    min-width: 200px;
    box-shadow:
      3px 3px 0 rgba(0,0,0,0.12),
      6px 6px 0 rgba(0,0,0,0.07);
  }
  .lib-schema-card:hover {
    transform: translateY(-8px) rotate(-0.5deg);
    box-shadow:
      6px 12px 0 rgba(0,0,0,0.18),
      12px 20px 0 rgba(0,0,0,0.09);
  }
  .lib-schema-seal {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, #8b4513 0%, #5c2d0e 100%);
    border: 3px solid #d4af37;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 0 5px rgba(212,175,55,0.15),
      0 8px 24px rgba(0,0,0,0.3),
      inset 0 2px 6px rgba(0,0,0,0.4);
    transition: all 0.28s;
  }
  .lib-schema-card:hover .lib-schema-seal {
    border-color: #f0d080;
    box-shadow: 0 0 0 5px rgba(212,175,55,0.3), 0 12px 32px rgba(0,0,0,0.4), inset 0 2px 6px rgba(0,0,0,0.4);
  }
  .lib-schema-yr {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 900;
    color: #f0d080;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  }
  .lib-schema-ed {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: rgba(240,208,128,0.6);
    text-transform: uppercase;
    margin-top: 3px;
  }
  .lib-schema-lbl {
    font-family: 'IM Fell English', serif;
    font-size: 13px;
    font-style: italic;
    color: rgba(60,30,0,0.55);
    margin: 0;
  }
  .lib-schema-ribbon {
    background: linear-gradient(135deg, #8b4513, #c67c3a);
    color: #f0d080;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 6px 20px;
    border-radius: 2px;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    transition: all 0.2s;
  }
  .lib-schema-card:hover .lib-schema-ribbon {
    background: linear-gradient(135deg, #a0521a, #d4904a);
    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  }

  /* ══ CATALOGUE (Subjects) ══ */
  .lib-catalogue {
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 4px;
    overflow: hidden;
    background: rgba(10,5,0,0.3);
    backdrop-filter: blur(4px);
  }
  .lib-cat-header {
    display: grid;
    grid-template-columns: 48px 1fr 100px 140px;
    gap: 0;
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(80,40,0,0.6), rgba(60,30,0,0.6));
    border-bottom: 1px solid rgba(212,175,55,0.2);
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: rgba(212,175,55,0.6);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .lib-cat-row {
    display: grid;
    grid-template-columns: 48px 1fr 100px 140px;
    gap: 0;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(212,175,55,0.07);
    transition: all 0.18s;
    animation: libFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .lib-cat-row:last-of-type { border-bottom: none; }
  .lib-cat-row:hover {
    background: rgba(212,175,55,0.05);
    padding-left: 30px;
  }
  .lib-cat-num {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: rgba(212,175,55,0.3);
  }
  .lib-cat-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-right: 16px;
  }
  .lib-cat-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: #f5e6c8;
  }
  .lib-cat-desc {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: rgba(245,230,200,0.35);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .lib-cat-code {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #d4af37;
    letter-spacing: 0.06em;
  }
  .lib-read-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #5c2d0e, #8b4513);
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 3px;
    color: #f0d080;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }
  .lib-read-btn:hover {
    background: linear-gradient(135deg, #8b4513, #c67c3a);
    border-color: rgba(212,175,55,0.6);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  }
  .lib-cat-footer {
    padding: 14px 24px;
    border-top: 1px solid rgba(212,175,55,0.15);
    background: rgba(80,40,0,0.3);
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 13px;
    color: rgba(212,175,55,0.35);
    text-align: center;
  }

  /* ══ PDF PREVIEW — Open Book Modal ══ */
  .lib-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,5,0,0.88);
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: libFadeOverlay 0.25s ease both;
  }
  @keyframes libFadeOverlay { from { opacity: 0; } to { opacity: 1; } }

  .lib-book-modal {
    display: flex;
    width: 100%;
    max-width: 980px;
    height: min(88vh, 700px);
    border-radius: 4px;
    overflow: hidden;
    box-shadow:
      0 40px 120px rgba(0,0,0,0.8),
      0 0 0 1px rgba(212,175,55,0.15),
      inset 0 1px 0 rgba(255,255,255,0.04);
    animation: libBookOpen 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes libBookOpen {
    from { opacity: 0; transform: scale(0.92) translateY(30px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Left spine */
  .lib-modal-spine {
    width: 52px;
    background: linear-gradient(to right, #1a0a00, #3d2409, #2d1a00);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    gap: 12px;
    border-right: 2px solid rgba(212,175,55,0.2);
    flex-shrink: 0;
    position: relative;
  }
  .lib-modal-spine::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    width: 6px;
    background: linear-gradient(to right, rgba(212,175,55,0.08), transparent);
  }
  .lib-modal-spine-text {
    font-family: 'Playfair Display', serif;
    font-size: 12px;
    font-weight: 700;
    color: rgba(212,175,55,0.7);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    letter-spacing: 0.08em;
    max-height: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lib-modal-spine-code {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    font-weight: 700;
    color: rgba(212,175,55,0.4);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  /* Right page */
  .lib-modal-page {
    flex: 1;
    background: linear-gradient(135deg, #faf5e8, #f5ead5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* Paper lines */
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 27px,
      rgba(139,90,60,0.07) 28px
    ),
    linear-gradient(135deg, #faf5e8, #f5ead5);
  }
  .lib-modal-page-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .lib-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(139,90,60,0.2);
    flex-shrink: 0;
    background: rgba(240,220,180,0.4);
  }
  .lib-modal-stamp {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 800;
    color: rgba(100,50,10,0.5);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 2px solid rgba(100,50,10,0.25);
    padding: 4px 12px;
    border-radius: 2px;
    transform: rotate(-1deg);
  }
  .lib-modal-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lib-open-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #5c2d0e, #8b4513);
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 3px;
    color: #f0d080;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.18s;
    letter-spacing: 0.03em;
  }
  .lib-open-btn:hover {
    background: linear-gradient(135deg, #8b4513, #c67c3a);
    transform: translateY(-1px);
  }
  .lib-close-btn {
    width: 34px; height: 34px;
    border-radius: 3px;
    border: 1px solid rgba(139,90,60,0.25);
    background: rgba(139,90,60,0.08);
    color: rgba(60,30,0,0.5);
    cursor: pointer;
    font-size: 13px;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: center;
  }
  .lib-close-btn:hover {
    background: rgba(180,40,40,0.12);
    border-color: rgba(180,40,40,0.3);
    color: #c0392b;
  }
  .lib-modal-title-wrap {
    padding: 18px 28px 14px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(139,90,60,0.12);
  }
  .lib-modal-code {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: rgba(100,50,10,0.5);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 5px;
  }
  .lib-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #2d1500;
    margin: 0 0 5px;
  }
  .lib-modal-desc {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 13px;
    color: rgba(60,30,0,0.5);
    margin: 0 0 10px;
  }
  .lib-divider-ornament {
    font-size: 12px;
    color: rgba(139,90,60,0.35);
    letter-spacing: 4px;
  }
  .lib-iframe-wrap {
    flex: 1;
    overflow: hidden;
    background: #fff;
  }
  .lib-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  /* ══ FOOTER ══ */
  .lib-footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 32px 24px;
    border-top: 1px solid rgba(212,175,55,0.1);
  }
  .lib-footer-rule {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 300px;
    margin: 0 auto 16px;
    color: rgba(212,175,55,0.3);
    font-size: 12px;
  }
  .lib-footer-txt {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 13px;
    color: rgba(245,230,200,0.2);
    margin: 0;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 640px) {
    .lib-hero { padding: 60px 20px 52px; }
    .lib-hero-h1 { font-size: 3rem; }
    .lib-stats { padding: 14px 20px; gap: 16px; }
    .lib-container { padding: 0 16px; }
    .lib-books-row { gap: 4px; }
    .lib-book-cover { width: 70px; height: 130px; }
    .lib-book-short { font-size: 14px; }
    .lib-sem-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .lib-schema-row { gap: 16px; }
    .lib-schema-card { min-width: 160px; padding: 28px 20px; }
    .lib-cat-header, .lib-cat-row { grid-template-columns: 36px 1fr 80px; }
    .lib-cat-header span:nth-child(4), .lib-cat-row .lib-read-btn { grid-column: 1/-1; }
    .lib-cat-row { padding: 14px 16px; }
    .lib-book-modal { flex-direction: column; height: 92vh; }
    .lib-modal-spine { width: 100%; height: 44px; flex-direction: row; writing-mode: unset; padding: 0 16px; border-right: none; border-bottom: 2px solid rgba(212,175,55,0.2); }
    .lib-modal-spine-text, .lib-modal-spine-code { writing-mode: horizontal-tb; transform: none; }
    .lib-hero-ornament { font-size: 1.5rem; }
  }
`;

export default NotesPage;
