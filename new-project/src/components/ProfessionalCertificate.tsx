import React from 'react';

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  certificateId: string;
  date: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ProfessionalCertificate: React.FC<CertificateProps> = ({ 
  studentName, 
  courseTitle, 
  certificateId, 
  date,
  containerRef 
}) => {
  return (
    <div 
      ref={containerRef}
      className="w-[1123px] h-[794px] bg-white relative overflow-hidden font-serif select-none shadow-2xl mx-auto"
      style={{ width: '1123px', height: '794px' }}
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 border-[30px] border-emerald-900/5 shadow-inner pointer-events-none"></div>
      <div className="absolute inset-[40px] border-[2px] border-emerald-800/20"></div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-40 h-40 border-t-[10px] border-l-[10px] border-emerald-800/30"></div>
      <div className="absolute top-0 right-0 w-40 h-40 border-t-[10px] border-r-[10px] border-emerald-800/30"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[10px] border-l-[10px] border-emerald-800/30"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[10px] border-r-[10px] border-emerald-800/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-24 py-20 text-center">
        
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-[0.3em] text-emerald-900 uppercase">Dikshannt</h2>
          <div className="h-0.5 w-full bg-emerald-800/20 mt-2"></div>
          <p className="text-[10px] tracking-[0.5em] text-emerald-600 mt-1 uppercase font-sans">The Scholarly Sanctuary</p>
        </div>

        <h1 className="text-6xl font-serif text-emerald-900 mb-4 italic font-light">Certificate of Excellence</h1>
        <p className="text-sm tracking-[0.2em] text-emerald-700/60 uppercase mb-12 font-sans font-bold">This Distinguished Honor is Bestowed Upon</p>

        <div className="relative mb-12">
           <span className="text-6xl font-serif text-slate-800 block mb-2">{studentName}</span>
           <div className="w-96 h-px bg-emerald-800/30 mx-auto"></div>
        </div>

        <p className="text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto mb-16 font-serif px-12">
          for the successful completion of the academic requirements and research benchmarks in the discipline of <br/>
          <span className="text-2xl text-emerald-800 font-bold block mt-4 uppercase tracking-tight">{courseTitle}</span>
        </p>

        {/* Footer Metadata */}
        <div className="grid grid-cols-3 w-full items-end mt-auto">
          <div className="text-left">
            <div className="w-48 h-px bg-slate-300 mb-4"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrar Signature</p>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="size-24 rounded-full border-2 border-emerald-500/20 flex items-center justify-center mb-6">
                <div className="size-20 rounded-full border border-emerald-500/40 flex items-center justify-center opacity-40">
                  <span className="text-[8px] font-bold text-emerald-800 rotate-12">VERIFIED</span>
                </div>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Issue Date: {date}</p>
          </div>

          <div className="text-right">
            <div className="w-48 h-px bg-slate-300 mb-4 ml-auto"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Dean</p>
          </div>
        </div>

        {/* Verification ID */}
        <div className="absolute bottom-8 left-12">
          <p className="text-[8px] font-mono text-slate-300 uppercase tracking-widest">Credential ID: {certificateId}</p>
        </div>
        
        <div className="absolute bottom-8 right-12">
          <p className="text-[8px] font-mono text-slate-300 uppercase tracking-widest px-2 py-1 border border-slate-100 italic">Authenticity Verified at dikshannt.com</p>
        </div>

      </div>
    </div>
  );
};

export default ProfessionalCertificate;
