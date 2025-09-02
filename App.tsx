
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Candidate, TestAnswers, TestResults } from './types';
import { DEFAULT_CANDIDATE, DEFAULT_ANSWERS, DEFAULT_RESULTS } from './constants';
import Landing from './components/Landing';
import Registration from './components/Registration';
import TestRunner from './components/TestRunner';
import ResultsDashboard from './components/ResultsDashboard';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.LANDING);
  const [candidate, setCandidate] = useState<Candidate>(DEFAULT_CANDIDATE);
  const [answers, setAnswers] = useState<TestAnswers>(DEFAULT_ANSWERS);
  const [results, setResults] = useState<TestResults | null>(null);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedCandidate = localStorage.getItem('psikotest_candidate');
      const savedAnswers = localStorage.getItem('psikotest_answers');
      const savedResults = localStorage.getItem('psikotest_results');

      if (savedResults) {
        setResults(JSON.parse(savedResults));
        setCandidate(JSON.parse(savedCandidate || JSON.stringify(DEFAULT_CANDIDATE)));
        setPage(Page.RESULTS);
      } else if (savedAnswers && Object.keys(JSON.parse(savedAnswers)).length > 0) {
        setCandidate(JSON.parse(savedCandidate || JSON.stringify(DEFAULT_CANDIDATE)));
        setAnswers(JSON.parse(savedAnswers));
        setPage(Page.TEST);
      } else if (savedCandidate) {
         setCandidate(JSON.parse(savedCandidate));
         setPage(Page.REGISTRATION);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('psikotest_candidate');
      localStorage.removeItem('psikotest_answers');
      localStorage.removeItem('psikotest_results');
    }
  }, []);
  
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const handleStart = () => {
    setPage(Page.REGISTRATION);
  };
  
  const handleRegister = (data: Candidate) => {
    setCandidate(data);
    localStorage.setItem('psikotest_candidate', JSON.stringify(data));
    setPage(Page.TEST);
  };
  
  const handleFinishTest = (finalAnswers: TestAnswers) => {
    setAnswers(finalAnswers);
    // Move to results page, calculation will happen there
    setPage(Page.RESULTS);
  };
  
  const handleRetakeTest = () => {
    setPage(Page.LANDING);
    setCandidate(DEFAULT_CANDIDATE);
    setAnswers(DEFAULT_ANSWERS);
    setResults(null);
    localStorage.removeItem('psikotest_candidate');
    localStorage.removeItem('psikotest_answers');
    localStorage.removeItem('psikotest_results');
  };

  const renderPage = () => {
    switch (page) {
      case Page.LANDING:
        return <Landing onStart={handleStart} />;
      case Page.REGISTRATION:
        return <Registration onRegister={handleRegister} candidateData={candidate} />;
      case Page.TEST:
        return <TestRunner savedAnswers={answers} onFinish={handleFinishTest} />;
      case Page.RESULTS:
        return <ResultsDashboard candidate={candidate} answers={answers} onRetake={handleRetakeTest} savedResults={results} />;
      default:
        return <Landing onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-bg to-gray-light min-h-screen font-sans text-gray-dark">
      {renderPage()}
    </div>
  );
};

export default App;
