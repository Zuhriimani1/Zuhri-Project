
import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { Candidate, TestAnswers, TestResults, PersonalityScores, CognitiveScores, InterestScores, CompetencyScores } from '../types';
import { LOGIC_QUESTIONS, NUMERIC_QUESTIONS, VERBAL_QUESTIONS, VISUAL_QUESTIONS, INTEREST_MAPPING } from '../constants';
import { generatePDFReport } from '../services/pdfService';

interface ResultsDashboardProps {
  candidate: Candidate;
  answers: TestAnswers;
  onRetake: () => void;
  savedResults: TestResults | null;
}

// Helper scoring functions defined outside the component
const calculatePersonalityScores = (answers: TestAnswers): PersonalityScores => {
  const scores = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };
  for (let i = 0; i < 50; i++) {
    const dimension = Math.floor(i / 10);
    const answer = parseInt(answers[`personality_${i}`] as string || '3');
    switch (dimension) {
      case 0: scores.openness += answer; break;
      case 1: scores.conscientiousness += answer; break;
      case 2: scores.extraversion += answer; break;
      case 3: scores.agreeableness += answer; break;
      case 4: scores.neuroticism += answer; break;
    }
  }
  Object.keys(scores).forEach(key => {
    scores[key as keyof PersonalityScores] = Math.max(0, Math.min(100, Math.round(((scores[key as keyof PersonalityScores] - 10) / 40) * 100)));
  });
  return scores;
};

const calculateCognitiveScores = (answers: TestAnswers): CognitiveScores => {
  let logicCorrect = 0, numericCorrect = 0, verbalCorrect = 0, visualCorrect = 0;
  LOGIC_QUESTIONS.forEach((q, i) => { if (answers[`logic_${i}`] === q.correct) logicCorrect++; });
  NUMERIC_QUESTIONS.forEach((q, i) => { if (answers[`numeric_${i}`] === q.correct) numericCorrect++; });
  VERBAL_QUESTIONS.forEach((q, i) => { if (answers[`verbal_${i}`] === q.correct) verbalCorrect++; });
  VISUAL_QUESTIONS.forEach((q, i) => { if (answers[`visual_${i}`] === q.correct) visualCorrect++; });
  
  const logic = Math.round((logicCorrect / LOGIC_QUESTIONS.length) * 100);
  const numeric = Math.round((numericCorrect / NUMERIC_QUESTIONS.length) * 100);
  const verbal = Math.round((verbalCorrect / VERBAL_QUESTIONS.length) * 100);
  const visual = Math.round((visualCorrect / VISUAL_QUESTIONS.length) * 100);

  return { logic, numeric, verbal, visual, overall: Math.round((logic + numeric + verbal + visual) / 4) };
};

const calculateInterestScores = (answers: TestAnswers): InterestScores => {
    const interests: InterestScores = { realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0 };
    for (let i = 0; i < 30; i++) {
        const answer = answers[`interest_${i}`];
        const mapping = INTEREST_MAPPING[i % INTEREST_MAPPING.length];
        if (answer === 'A') interests[mapping[0] as keyof InterestScores]++;
        else if (answer === 'B') interests[mapping[1] as keyof InterestScores]++;
    }
    return interests;
};

const analyzeCompetencies = (p: PersonalityScores, c: CognitiveScores, i: InterestScores): CompetencyScores => ({
    leadership: Math.round((p.extraversion * 0.4) + (p.conscientiousness * 0.4) + ((100 - p.neuroticism) * 0.2)),
    analytical: Math.round((c.logic * 0.4) + (c.numeric * 0.4) + (p.openness * 0.2)),
    communication: Math.round((c.verbal * 0.4) + (p.extraversion * 0.3) + (p.agreeableness * 0.3)),
    creativity: Math.round((p.openness * 0.5) + (i.artistic * 5) + (c.visual * 0.3)),
    teamwork: Math.round((p.agreeableness * 0.5) + (p.extraversion * 0.3) + ((100 - p.neuroticism) * 0.2))
});

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="w-16 h-16 border-8 border-gray-light border-t-primary-blue rounded-full animate-spin"></div>
    <p className="mt-4 text-xl text-gray-medium">Menganalisis hasil...</p>
  </div>
);

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ candidate, answers, onRetake, savedResults }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResults | null>(savedResults);

  useEffect(() => {
    if (!savedResults) {
        const timer = setTimeout(() => {
            const personality = calculatePersonalityScores(answers);
            const cognitive = calculateCognitiveScores(answers);
            const interest = calculateInterestScores(answers);
            const competencies = analyzeCompetencies(personality, cognitive, interest);
            const finalResults: TestResults = {
                personality, cognitive, interest, competencies,
                timestamp: new Date().toISOString()
            };
            setResults(finalResults);
            localStorage.setItem('psikotest_results', JSON.stringify(finalResults));
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    } else {
        setLoading(false);
    }
  }, [answers, savedResults]);

  if (loading || !results) return <LoadingSpinner />;
  
  const personalityData = [
    { subject: 'Keterbukaan', A: results.personality.openness, fullMark: 100 },
    { subject: 'Kehati-hatian', A: results.personality.conscientiousness, fullMark: 100 },
    { subject: 'Ekstraversi', A: results.personality.extraversion, fullMark: 100 },
    { subject: 'Keramahan', A: results.personality.agreeableness, fullMark: 100 },
    { subject: 'Stabilitas Emosi', A: 100 - results.personality.neuroticism, fullMark: 100 },
  ];

  const cognitiveData = [
    { name: 'Logika', score: results.cognitive.logic },
    { name: 'Numerik', score: results.cognitive.numeric },
    { name: 'Verbal', score: results.cognitive.verbal },
    { name: 'Visual', score: results.cognitive.visual },
  ];
  
  const interestData = Object.entries(results.interest)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    // FIX: Made the sort comparator more robust to prevent type errors with arithmetic operations.
    .sort((a, b) => Number(b.value) - Number(a.value));

  const topInterest = interestData[0]?.name || 'Tidak Terdefinisi';
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-primary-blue">🎯 Hasil Psikotes</h1>
        <p className="text-xl text-gray-medium mt-2">{candidate.nama}</p>
        <p className="text-gray-medium">Tanggal Tes: {new Date(candidate.testDate || results.timestamp).toLocaleDateString('id-ID')}</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            {/* Personality */}
            <ResultCard title="Profil Kepribadian (Big Five)">
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={candidate.nama} dataKey="A" stroke="#0066CC" fill="#0066CC" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </ResultCard>

            {/* Cognitive */}
            <ResultCard title="Kemampuan Kognitif">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cognitiveData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#4A90E2" />
                </BarChart>
              </ResponsiveContainer>
            </ResultCard>
        </div>

        <div className="space-y-8">
            {/* Competencies */}
            <ResultCard title="Profil Kompetensi">
                <div className="space-y-4">
                    {Object.entries(results.competencies).map(([key, value]) => (
                        <CompetencyItem key={key} name={key.charAt(0).toUpperCase() + key.slice(1)} score={value} />
                    ))}
                </div>
            </ResultCard>
            
            {/* Interests */}
            <ResultCard title="Minat & Bakat (RIASEC)">
              <div className="text-center">
                  <p className="text-gray-medium">Kecenderungan Minat Teratas:</p>
                  <p className="text-3xl font-bold text-secondary-blue my-2">{topInterest}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {interestData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </ResultCard>

        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
        <button onClick={() => generatePDFReport(candidate, results)} className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          📄 Download Laporan PDF
        </button>
        <button onClick={onRetake} className="bg-white text-gray-medium font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
          🔄 Ulangi Tes
        </button>
      </div>
    </div>
  );
};

const ResultCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-dark mb-4">{title}</h2>
        {children}
    </div>
);

const CompetencyItem: React.FC<{name: string, score: number}> = ({ name, score }) => {
    const stars = Math.round(score / 20);
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-medium">{name}</span>
                <div className="flex text-xl">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                </div>
            </div>
            <div className="w-full bg-gray-light rounded-full h-2.5">
                <div className="bg-secondary-blue h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export default ResultsDashboard;
