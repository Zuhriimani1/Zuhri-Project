
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center space-x-3">
        <svg className="flex-shrink-0 w-5 h-5 text-success-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
        <span>{children}</span>
    </li>
);

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <main className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary-blue mb-4">PsikoTest Pro</h1>
          <p className="text-xl md:text-2xl text-gray-medium">Solusi Psikotes Digital untuk Rekrutmen Modern</p>
        </header>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-dark mb-6">Fitur Utama</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left text-lg text-gray-medium">
            <FeatureItem>6 jenis tes psikologi lengkap</FeatureItem>
            <FeatureItem>Analisis kepribadian Big Five</FeatureItem>
            <FeatureItem>Laporan PDF otomatis & instan</FeatureItem>
            <FeatureItem>Dashboard hasil visual interaktif</FeatureItem>
            <FeatureItem>Desain modern dan responsif</FeatureItem>
            <li className="flex items-center space-x-3 text-primary-blue font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Estimasi waktu: 45-60 menit</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={onStart} 
          className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          MULAI TES SEKARANG
        </button>
      </main>
      <footer className="mt-16 text-gray-medium">
        <p>&copy; {new Date().getFullYear()} PsikoTest Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
