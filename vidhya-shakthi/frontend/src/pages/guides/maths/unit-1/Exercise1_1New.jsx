import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool } from 'lucide-react';
import { unit1Perfect } from '../../../../data/unit1_perfect';
import LatexText from '../../../../features/learning/components/LatexText.jsx';

const Exercise1_1New = () => {
  const navigate = useNavigate();
  const section = unit1Perfect.sections[0]; // Exercise 1.1

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-800 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white min-h-screen shadow-xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-8 px-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-3xl shadow-md">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-100 hover:text-white font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            பின்புறம் செல்க
          </button>
          
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-200" size={28} />
            <h1 className="text-3xl font-extrabold tracking-tight">
              {unit1Perfect.title}
            </h1>
          </div>
          <p className="text-blue-100 mt-2 text-lg font-medium opacity-90">
            {section.title} - {section.introText}
          </p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8 flex-1 overflow-y-auto space-y-12">
          {section.problems.map((problem, index) => (
            <div key={problem.id} className="space-y-6">
              
              {/* Question Header */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-indigo-200">
                  {problem.number}
                </div>
                <div className="pt-1 flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 leading-relaxed">
                    {problem.title}
                  </h3>
                  
                  {/* LaTeX Statement block */}
                  {problem.statementLatex && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 overflow-x-auto">
                      <LatexText text={problem.statementLatex} />
                    </div>
                  )}
                </div>
              </div>

              {/* Steps (Solution) */}
              <div className="pl-14 space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <PenTool size={18} />
                  <span className="font-bold text-lg border-b-2 border-indigo-200 pb-1">தீர்வு:</span>
                </div>
                
                {problem.guidedSteps.map((step) => (
                  <div key={step.stepIndex} className="space-y-3">
                    <p className="font-semibold text-gray-700 text-base">{step.prompt}</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner overflow-x-auto">
                      <LatexText text={step.latexIntermediate} forceMath />
                    </div>
                  </div>
                ))}
                
                {problem.fullSolutionWalkthrough && (
                  <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                    <p className="text-gray-600 italic text-sm">
                      {problem.fullSolutionWalkthrough}
                    </p>
                  </div>
                )}
              </div>

              {/* Horizontal Line Separator (only if not the last item) */}
              {index !== section.problems.length - 1 && (
                <hr className="my-10 border-t-2 border-gray-200 rounded-full" />
              )}
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Exercise1_1New;
