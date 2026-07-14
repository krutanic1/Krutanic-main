import React from 'react';

const StudyMaterialsPage = () => {
    return (
        <section className="nd-section" style={{ minHeight: '80vh', padding: '30px' }}>
            <style>
                {`
                .study-materials-header {
                    margin-bottom: 40px;
                }
                .study-materials-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #111827;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 0 0 8px 0;
                }
                .study-materials-subtitle {
                    color: #6b7280;
                    font-size: 1.1rem;
                    margin: 0;
                }
                .premium-book-card {
                    position: relative;
                    background: #ffffff;
                    border: 1px solid rgba(255, 107, 0, 0.15);
                    border-radius: 24px;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
                    overflow: hidden;
                    max-width: 380px;
                    z-index: 1;
                }
                .premium-book-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 5px;
                    background: linear-gradient(90deg, #ff6b00, #ff9a44, #ff6b00);
                    background-size: 200% 100%;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    animation: gradientMove 3s ease infinite;
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .premium-book-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 25px 50px -15px rgba(255, 107, 0, 0.25);
                    border-color: rgba(255, 107, 0, 0.4);
                }
                .premium-book-card:hover::before {
                    opacity: 1;
                }
                .book-icon-wrapper {
                    width: 76px;
                    height: 76px;
                    background: linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, rgba(255, 154, 68, 0.15) 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    color: #ff6b00;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .premium-book-card:hover .book-icon-wrapper {
                    transform: scale(1.15) rotate(-8deg);
                    background: linear-gradient(135deg, #ff6b00 0%, #ff9a44 100%);
                    color: white;
                    box-shadow: 0 10px 20px rgba(255, 107, 0, 0.3);
                }
                .book-badge {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: rgba(255, 107, 0, 0.1);
                    color: #ff6b00;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                }
                .premium-book-card:hover .book-badge {
                    background: #ff6b00;
                    color: white;
                }
                .book-title {
                    margin: 0 0 12px 0;
                    color: #111827;
                    font-size: 1.5rem;
                    font-weight: 800;
                    line-height: 1.3;
                }
                .book-desc {
                    margin: 0 0 28px 0;
                    color: #6b7280;
                    font-size: 1rem;
                    line-height: 1.6;
                }
                .book-action {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    color: #ff6b00;
                    font-weight: 700;
                    font-size: 1.05rem;
                    transition: gap 0.3s ease;
                    gap: 8px;
                }
                .premium-book-card:hover .book-action {
                    gap: 14px;
                }
                .bg-blob {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(255,107,0,0.06) 0%, rgba(255,255,255,0) 70%);
                    top: -60px;
                    right: -60px;
                    border-radius: 50%;
                    z-index: -1;
                    transition: transform 0.6s ease;
                }
                .premium-book-card:hover .bg-blob {
                    transform: scale(1.3);
                }
                `}
            </style>

            <div className="study-materials-header">
                <h2 className="study-materials-title">
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#ff6b00' }}>local_library</span>
                    Premium Study Materials
                </h2>
                <p className="study-materials-subtitle">Access your exclusive guides, e-books, and learning resources.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {[
                    {
                        title: "Introduction",
                        subtitle: "Course Overview",
                        desc: "Start your learning journey here. This introduction covers all the essentials and sets the foundation for your career.",
                        icon: "rocket_launch",
                        badge: "Start Here",
                        link: "https://drive.google.com/file/d/1nxy5LXAJoHrJIFu-TIhkHoY04Vh3c9sY/view?usp=drive_link"
                    },
                    {
                        title: "Data Foundation",
                        subtitle: "Complete Guide",
                        desc: "Master the core concepts of data foundation. Dive deep into essential analytics, structures, and modern workflows required for your career.",
                        icon: "auto_stories",
                        badge: "PDF Guide",
                        link: "https://drive.google.com/file/d/1MtzompuCslZJfN0dVvNN9RrlcXYNLyaT/view?usp=drive_link"
                    },
                    {
                        title: "Microsoft Excel",
                        subtitle: "Mastery Guide",
                        desc: "Unlock the full potential of Microsoft Excel. Learn advanced formulas, pivot tables, data visualization, and automation techniques.",
                        icon: "table_view",
                        badge: "E-Book",
                        link: "https://drive.google.com/file/d/1ZhJH6682ECVKmPsw4Jb8e_2eR62fVYG6/view?usp=drive_link"
                    }
                ].map((book, index) => (
                    <a 
                        key={index}
                        href={book.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="premium-book-card"
                    >
                        <div className="bg-blob"></div>
                        <span className="book-badge">{book.badge}</span>
                        <div className="book-icon-wrapper">
                            <span className="material-symbols-outlined" style={{ fontSize: '38px' }}>
                                {book.icon}
                            </span>
                        </div>
                        <h3 className="book-title">{book.title}<br/>{book.subtitle}</h3>
                        <p className="book-desc">{book.desc}</p>
                        <div className="book-action">
                            <span>Access Resource</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                        </div>
                    </a>
                ))}
            </div>
                    
        </section>
    );
};
 
export default StudyMaterialsPage;
