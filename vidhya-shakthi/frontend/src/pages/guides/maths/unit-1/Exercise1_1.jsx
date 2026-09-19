import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, X, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: '1',
    type: '2 மதிப்பெண்கள்',
    typeBadgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    cardBorder: 'border-gray-700',
    question: 'A = {1, 2, 3} மற்றும் B = {a, b} எனில், A × B மற்றும் B × A ஐ காண்க.',
    shortAnswer: 'A × B = {(1,a), (1,b), ...}',
    steps: [
      { 
        title: 'படி 1 (கொடுக்கப்பட்டவை)', 
        content: (
          <div className="font-serif text-center text-lg space-y-1">
            <p>A = {'{1, 2, 3}'}</p>
            <p>B = {'{a, b}'}</p>
          </div>
        ),
        style: 'border-gray-700 bg-gray-800/80 text-gray-200'
      },
      { 
        title: 'படி 2 (A × B காண்க)', 
        content: (
          <div className="font-serif text-center text-md space-y-2">
            <p>A × B = {'{1, 2, 3}'} × {'{a, b}'}</p>
            <p className="text-indigo-300">= {'{(1,a), (1,b), (2,a), (2,b), (3,a), (3,b)}'}</p>
          </div>
        ),
        style: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-100'
      },
      { 
        title: 'படி 3 (B × A காண்க)', 
        content: (
          <div className="font-serif text-center text-md space-y-2">
            <p>B × A = {'{a, b}'} × {'{1, 2, 3}'}</p>
            <p className="text-pink-300">= {'{(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)}'}</p>
          </div>
        ),
        style: 'border-gray-700 bg-gray-800/80'
      }
    ],
    finalAnswer: 'A × B மற்றும் B × A கண்டறியப்பட்டது.'
  },
  {
    id: '2',
    type: '5 மதிப்பெண்கள்',
    typeBadgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    cardBorder: 'border-indigo-900/50',
    question: 'A = {1, 2, 3}, B = {2, 3, 5}, C = {3, 4} மற்றும் D = {1, 3, 5} எனில், (A ∩ C) × (B ∩ D) = (A × B) ∩ (C × D) என்பது உண்மையா என சோதிக்கவும்.',
    shortAnswer: 'ஆம், உண்மை',
    steps: [
      { 
        title: 'படி 1 (கொடுக்கப்பட்டவை)', 
        content: (
          <div className="font-serif text-center text-md space-y-1">
            <p>A = {'{1, 2, 3}'}, B = {'{2, 3, 5}'}</p>
            <p>C = {'{3, 4}'}, D = {'{1, 3, 5}'}</p>
          </div>
        ),
        style: 'border-gray-700 bg-gray-800/80'
      },
      { 
        title: 'படி 2 (LHS - இடதுகை பக்கம்)', 
        content: (
          <div className="font-serif text-center text-md space-y-2">
            <p>A ∩ C = {'{3}'}</p>
            <p>B ∩ D = {'{3, 5}'}</p>
            <p className="text-indigo-300">(A ∩ C) × (B ∩ D) = {'{(3,3), (3,5)}'} --- (1)</p>
          </div>
        ),
        style: 'border-indigo-500/50 bg-indigo-950/40'
      },
      { 
        title: 'படி 3 (RHS - வலதுகை பக்கம்)', 
        content: (
          <div className="font-serif text-center text-md space-y-2">
            <p>A × B = {'{..., (3,3), (3,5), ...}'}</p>
            <p>C × D = {'{..., (3,3), (3,5), ...}'}</p>
            <p className="text-pink-300">(A × B) ∩ (C × D) = {'{(3,3), (3,5)}'} --- (2)</p>
          </div>
        ),
        style: 'border-gray-700 bg-gray-800/80'
      }
    ],
    finalAnswer: '(1) = (2) எனவே நிரூபிக்கப்பட்டது.'
  }
];

const Exercise1_1 = () => {
  const navigate = useNavigate();
  const [selectedSolution, setSelectedSolution] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans text-gray-100 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-md bg-[#0d1323] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#151f38] to-[#0d1323]">
          <button 
            onClick={() => navigate('/guides/maths/unit-1')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            பயிற்சிகள் தேர்வுக்கு செல்க
          </button>
          
          <h1 className="text-2xl font-bold leading-tight mb-2">பயிற்சி 1.1</h1>
          <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1.5 rounded-full font-medium">
            பாடம் 1: உறவுகளும் சார்புகளும்
          </span>
        </div>

        {/* Question Cards */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32 pt-2">
          {questions.map((q) => (
            <div key={q.id} className={`bg-[#131b2f] border ${q.cardBorder} rounded-2xl p-5 shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${q.typeBadgeColor}`}>
                  {q.type}
                </span>
                <span className="text-xs text-gray-500 font-medium">Q.No: {q.id}</span>
              </div>
              
              <h2 className="text-lg font-serif mb-6 text-gray-200 leading-relaxed">
                {q.question}
              </h2>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-400 font-serif line-clamp-1 max-w-[50%]">
                  விடை: {q.shortAnswer}
                </span>
                
                <button 
                  onClick={() => setSelectedSolution(q)}
                  className="bg-white text-black hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  பதில் <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Bottom Sheet / Modal */}
        {selectedSolution && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedSolution(null)} />
            
            <div className="bg-[#1a233a] w-full rounded-t-3xl border-t border-gray-700 relative z-10 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
              
              {/* Drag Handle & Close */}
              <div className="flex justify-center pt-4 pb-2 relative">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
                <button 
                  onClick={() => setSelectedSolution(null)}
                  className="absolute right-6 top-4 p-1.5 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Solution Content */}
              <div className="overflow-y-auto px-6 py-4 space-y-5 pb-8">
                {selectedSolution.steps.map((step, idx) => (
                  <div key={idx} className={`border ${step.style} rounded-2xl p-5 shadow-inner`}>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">{step.title}</h4>
                    {step.content}
                  </div>
                ))}

                {/* Final Answer Block */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between mt-6">
                  <div className="font-serif text-emerald-400 flex-1">
                    <span className="font-sans font-bold text-emerald-500/80 mr-2 text-sm uppercase tracking-wide">இறுதி விடை:</span> 
                    <div className="mt-1 text-lg">{selectedSolution.finalAnswer}</div>
                  </div>
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={28} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default Exercise1_1;
