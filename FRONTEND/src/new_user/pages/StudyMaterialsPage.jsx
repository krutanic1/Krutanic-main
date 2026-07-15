import React from 'react';

const StudyMaterialsPage = () => {
    return (
        <section className="nd-section">
            <div className="nd-section-header">
                <h2 className="nd-section-title">
                    <span className="material-symbols-outlined nd-section-icon">menu_book</span>
                    Study Materials
                </h2>
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <a 
                    href="https://drive.google.com/file/d/1MtzompuCslZJfN0dVvNN9RrlcXYNLyaT/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nd-program-card hover-lift"
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '30px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                >
                    
                    //date and time fix
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ff6b00', marginBottom: '15px' }}>
                        auto_stories
                    </span>
                    <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>Book 1</h3>
                    <p style={{ margin: '0', color: '#6b7280', textAlign: 'center', fontSize: '0.875rem' }}>welcome</p>
                </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <a 
                    href="https://drive.google.com/file/d/1nxy5LXAJoHrJIFu-TIhkHoY04Vh3c9sY/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nd-program-card hover-lift"
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '30px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                >
                    
                    
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ff6b00', marginBottom: '15px' }}>
                        auto_stories
                    </span>
                    <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>Book 2</h3>
                    <p style={{ margin: '0', color: '#6b7280', textAlign: 'center', fontSize: '0.875rem' }}>Data Foundation Complete Guide</p>
                </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <a 
                    href="https://drive.google.com/file/d/1ZhJH6682ECVKmPsw4Jb8e_2eR62fVYG6/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nd-program-card hover-lift"
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '30px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                >
                    
                    
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ff6b00', marginBottom: '15px' }}>
                        auto_stories
                    </span>
                    <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>Book 3</h3>
                    <p style={{ margin: '0', color: '#6b7280', textAlign: 'center', fontSize: '0.875rem' }}>Excel</p>
                </a>
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <a 
                    href="https://drive.google.com/file/d/1-47nVVxLIxSz9e0u-_ToCpKxOFBSGST3/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="nd-program-card hover-lift"
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '30px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                >
                    
                    
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ff6b00', marginBottom: '15px' }}>
                        auto_stories
                    </span>
                    <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>Book 4</h3>
                    <p style={{ margin: '0', color: '#6b7280', textAlign: 'center', fontSize: '0.875rem' }}>SQL </p>
                </a>
            </div>
        </section>
    );
};

export default StudyMaterialsPage;
