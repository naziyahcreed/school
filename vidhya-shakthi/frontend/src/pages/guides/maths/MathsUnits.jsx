import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, ChevronRight } from 'lucide-react';

const units = [
  { id: 'unit-1', name: 'பாடம் 1: உறவுகளும் சார்புகளும்', completed: 2, total: 5 },
  { id: 'unit-2', name: 'பாடம் 2: எண்களும் தொடர்வரிசைகளும்', completed: 0, total: 4 },
  { id: 'unit-3', name: 'பாடம் 3: இயற்கணிதம்', completed: 0, total: 8 }
];

const MathsUnits = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans text-gray-100 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-md bg-[#0d1323] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#151f38] to-[#0d1323]">
          <button 
            onClick={() => navigate('/guides')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            பின்செல்க (Back)
          </button>
          
          <div className="flex items-center gap-3">
            <Book className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold leading-tight">
              கணிதம்
            </h1>
          </div>
        </div>

        {/* Units List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32 pt-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">பாடங்கள் (Units)</h2>
          
          {units.map((unit) => (
            <Link key={unit.id} to={`/guides/maths/${unit.id}`} className="block">
              <div className="bg-[#131b2f] border border-gray-800 hover:border-gray-600 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-lg">
                <div className="flex-1 pr-4">
                  <h3 className="text-md font-bold text-gray-200 mb-2">{unit.name}</h3>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(unit.completed / unit.total) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">பயிற்சிகள்: {unit.completed}/{unit.total}</p>
                </div>
                <ChevronRight className="text-gray-500 flex-shrink-0" size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathsUnits;
