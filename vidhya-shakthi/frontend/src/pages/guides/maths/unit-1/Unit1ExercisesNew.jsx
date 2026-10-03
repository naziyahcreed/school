import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { unit1TamilNew } from '../../../../data/unit1_new';

const Unit1ExercisesNew = () => {
  const navigate = useNavigate();
  const [expandedProblem, setExpandedProblem] = useState(null);

  const toggleProblem = (id) => {
    setExpandedProblem(expandedProblem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans text-gray-100 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-md bg-[#0d1323] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#151f38] to-[#0d1323]">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            பின்புறம் செல்க
          </button>
          
          <div className="flex items-center gap-3">
            <Book className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold leading-tight">
              {unit1TamilNew.title}
            </h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            {unit1TamilNew.subtitle}
          </p>
        </div>

        {/* Content Section */}
        <div className="px-6 py-2 flex-1 overflow-y-auto space-y-6">
          {unit1TamilNew.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
                {section.title}
              </h2>
              <p className="text-sm text-gray-400">{section.introText}</p>
              
              <div className="space-y-3">
                {section.problems.map((problem) => (
                  <div key={problem.id} className="bg-[#151f38] rounded-xl overflow-hidden shadow-sm border border-gray-800">
                    <button 
                      onClick={() => toggleProblem(problem.id)}
                      className="w-full flex items-center justify-between p-4 bg-[#1a2542] hover:bg-[#202e50] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <FileText size={18} className="text-indigo-400" />
                        <div>
                          <span className="font-semibold text-gray-200 block">{problem.number}</span>
                          <span className="text-sm text-gray-400">{problem.title}</span>
                        </div>
                      </div>
                      {expandedProblem === problem.id ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                    </button>
                    
                    {expandedProblem === problem.id && (
                      <div className="p-5 space-y-4 bg-[#151f38] border-t border-gray-800">
                        <p className="text-sm text-gray-300 font-medium">
                          {problem.statementLatex}
                        </p>
                        
                        <div className="space-y-3 pt-3">
                          <h4 className="text-sm font-semibold text-indigo-300 mb-2">படிநிலைகள்:</h4>
                          {problem.guidedSteps.map((step) => (
                            <div key={step.stepIndex} className="bg-[#0d1323] p-3 rounded-lg border border-gray-800">
                              <p className="text-sm text-gray-400 mb-1">{step.prompt}</p>
                              <code className="text-sm text-emerald-400 block whitespace-pre-wrap font-mono">
                                {step.latexIntermediate}
                              </code>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-800">
                          <h4 className="text-sm font-semibold text-indigo-300 mb-2">முழுமையான தீர்வு:</h4>
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                            {problem.fullSolutionWalkthrough}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Unit1ExercisesNew;
