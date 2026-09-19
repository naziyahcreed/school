import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, ChevronRight } from 'lucide-react';

const exercises = [
  { id: 'exercise-1-1', name: 'பயிற்சி 1.1', totalQuestions: 7 },
  { id: 'exercise-1-2', name: 'பயிற்சி 1.2', totalQuestions: 5 },
  { id: 'exercise-1-3', name: 'பயிற்சி 1.3', totalQuestions: 10 }
];

const Unit1Exercises = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans text-gray-100 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-md bg-[#0d1323] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#151f38] to-[#0d1323]">
          <button 
            onClick={() => navigate('/guides/maths')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            பாடம் தேர்வுக்கு செல்க
          </button>
          
          <div className="flex items-center gap-3">
            <Book className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold leading-tight">
              பாடம் 1: <br/><span className="text-lg text-indigo-200">உறவுகளும் சார்புகளும்</span>
            </h1>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32 pt-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">பயிற்சிகள் (Exercises)</h2>
          
          {exercises.map((ex) => (
            <Link key={ex.id} to={`/guides/maths/unit-1/${ex.id}`} className="block">
              <div className="bg-[#131b2f] border border-gray-800 hover:border-gray-600 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-lg font-bold text-gray-200 mb-1">{ex.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">கேள்விகள்: {ex.totalQuestions}</p>
                </div>
                <ChevronRight className="text-gray-500" size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unit1Exercises;
