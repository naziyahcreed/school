import React from 'react';
import { Link } from 'react-router-dom';
import { Book, ChevronRight, Beaker, Globe, Calculator } from 'lucide-react';

const subjects = [
  { id: 'maths', name: 'கணிதம் (Maths)', icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'science', name: 'அறிவியல் (Science)', icon: Beaker, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'social', name: 'சமூக அறிவியல் (Social)', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10' }
];

const GuideHome = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans text-gray-100 pb-20 md:pb-8 flex justify-center">
      <div className="w-full max-w-md bg-[#0d1323] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#151f38] to-[#0d1323]">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold leading-tight">
              சுரா வழிகாட்டி
            </h1>
          </div>
          <p className="text-indigo-300 text-sm font-medium">10th Standard - All Subjects</p>
        </div>

        {/* Subjects List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32 pt-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">பாடங்கள் (Subjects)</h2>
          
          {subjects.map((sub) => (
            <Link key={sub.id} to={`/guides/${sub.id}`} className="block">
              <div className="bg-[#131b2f] border border-gray-800 hover:border-gray-600 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${sub.bg}`}>
                    <sub.icon className={sub.color} size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-200">{sub.name}</h3>
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

export default GuideHome;
