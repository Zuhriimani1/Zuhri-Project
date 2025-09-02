
import React, { useState, useEffect, useCallback } from 'react';
import { TestAnswers } from '../types';
import { 
    PERSONALITY_QUESTIONS, LOGIC_QUESTIONS, NUMERIC_QUESTIONS, VERBAL_QUESTIONS, 
    VISUAL_QUESTIONS, INTEREST_QUESTIONS, TEST_MODULES 
} from '../constants';

interface TestRunnerProps {
  savedAnswers: TestAnswers;
  onFinish: (answers: TestAnswers) => void;
}

const TestRunner: React.FC<TestRunnerProps> = ({ savedAnswers, onFinish }) => {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TestAnswers>(savedAnswers);
  const [showTransition, setShowTransition] = useState(false);

  const currentModule = TEST_MODULES[moduleIndex];
  const { key: moduleKey, name: moduleName, time: moduleTime, questionCount } = currentModule;

  const getQuestions = useCallback(() => {
    switch (moduleKey) {
      case 'personality': return PERSONALITY_QUESTIONS.map(q => ({ question: q }));
      case 'logic': return LOGIC_QUESTIONS;
      case 'numeric': return NUMERIC_QUESTIONS;
      case 'verbal': return VERBAL_QUESTIONS;
      case 'visual': return VISUAL_QUESTIONS;
      case 'interest': return INTEREST_QUESTIONS;
      default: return [];
    }
  }, [moduleKey]);

  const questions = getQuestions();
  const question = questions[currentQuestion];
  const totalProgress = (moduleIndex / TEST_MODULES.length) + ((currentQuestion + 1) / questionCount) / TEST_MODULES.length;

  useEffect(() => {
    localStorage.setItem('psikotest_answers', JSON.stringify(answers));
  }, [answers]);

  const handleSelectAnswer = (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [`${moduleKey}_${currentQuestion}`]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questionCount - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (moduleIndex < TEST_MODULES.length - 1) {
        setShowTransition(true);
      } else {
        onFinish(answers);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const continueToNextTest = () => {
    setModuleIndex(prev => prev + 1);
    setCurrentQuestion(0);
    setShowTransition(false);
  };

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md animate-fade-in">
          <h2 className="text-2xl font-bold text-success-green mb-2">✅ Bagian Selesai!</h2>
          <p className="text-gray-medium mb-6">Anda telah menyelesaikan bagian: <span className="font-semibold">{moduleName}</span></p>
          <p className="text-gray-medium mb-6">Selanjutnya:</p>
          <h3 className="text-3xl font-bold text-primary-blue mb-8">{TEST_MODULES[moduleIndex + 1].name}</h3>
          <button onClick={continueToNextTest} className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-bold py-3 px-12 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Lanjutkan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with Progress and Timer */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-2/3">
              <p className="text-sm text-gray-medium mb-1">{`Bagian ${moduleIndex + 1} dari ${TEST_MODULES.length}: ${moduleName}`}</p>
              <div className="w-full bg-gray-light rounded-full h-2.5">
                <div className="bg-success-green h-2.5 rounded-full" style={{ width: `${totalProgress * 100}%` }}></div>
              </div>
            </div>
            {moduleTime && <Timer minutes={moduleTime} onTimeUp={handleNext} key={moduleKey} />}
          </div>
        </div>
        
        {/* Question Box */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <p className="text-gray-medium mb-4">{`Pertanyaan ${currentQuestion + 1} dari ${questionCount}`}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-dark mb-6 min-h-[6rem] flex items-center">{question.question}</h3>
          {'pattern' in question && <p className="text-2xl font-mono bg-gray-100 p-4 rounded-lg text-center my-4">{question.pattern}</p>}
          <QuestionOptions moduleKey={moduleKey} question={question} currentAnswer={answers[`${moduleKey}_${currentQuestion}`]} onSelect={handleSelectAnswer} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={handlePrev} disabled={currentQuestion === 0} className="bg-white text-primary-blue font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">◀ Sebelumnya</button>
          
          {currentQuestion === questionCount - 1 && moduleIndex === TEST_MODULES.length - 1 ? (
            <button onClick={() => onFinish(answers)} className="bg-gradient-to-r from-success-green to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">Selesai Tes</button>
          ) : (
            <button onClick={handleNext} className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">Selanjutnya ▶</button>
          )}
        </div>
      </div>
    </div>
  );
};


const Timer: React.FC<{ minutes: number, onTimeUp: () => void }> = ({ minutes, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(minutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeUp]);

    const displayMinutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const displaySeconds = (timeLeft % 60).toString().padStart(2, '0');
    
    const timerClass = timeLeft <= 60 ? 'bg-danger-red text-white animate-pulse' : timeLeft <= 300 ? 'bg-warning-orange text-white' : 'bg-gray-light text-primary-blue';

    return (
        <div className={`text-2xl font-bold p-2 px-4 rounded-lg transition-colors ${timerClass}`}>
            <span>{displayMinutes}:{displaySeconds}</span>
        </div>
    );
};

const QuestionOptions: React.FC<{ moduleKey: string, question: any, currentAnswer: any, onSelect: (val: any) => void }> = ({ moduleKey, question, currentAnswer, onSelect }) => {
    if (moduleKey === 'personality') {
        const scales = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'];
        return (
            <div className="flex flex-wrap justify-center gap-3">
                {scales.map((scale, index) => (
                    <button key={index} onClick={() => onSelect(index + 1)} className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${currentAnswer === (index + 1) ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white text-gray-dark hover:border-secondary-blue'}`}>{scale}</button>
                ))}
            </div>
        );
    }

    if (moduleKey === 'interest') {
        return (
            <div className="space-y-4">
                {['A', 'B'].map(opt => (
                    <div key={opt} onClick={() => onSelect(opt)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${currentAnswer === opt ? 'bg-blue-100 border-primary-blue' : 'bg-gray-bg hover:border-secondary-blue'}`}>
                        <span className="font-bold mr-2">{opt}.</span>
                        <span>{opt === 'A' ? question.optionA : question.optionB}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {question.options?.map((option: string, index: number) => (
                <div key={index} onClick={() => onSelect(index)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${currentAnswer === index ? 'bg-blue-100 border-primary-blue' : 'bg-gray-bg hover:border-secondary-blue'}`}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                </div>
            ))}
        </div>
    );
};

export default TestRunner;
