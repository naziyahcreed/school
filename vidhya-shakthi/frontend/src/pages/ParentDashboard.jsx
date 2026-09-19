import React from 'react';
import { Activity, BookOpen, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans max-w-5xl mx-auto">
      <div className="flex justify-end gap-3 mb-4 text-sm">
        <span className="text-gray-600">{user?.full_name}</span>
        <button type="button" onClick={logout} className="flex items-center gap-1 text-rose-600 font-semibold">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Hello, Parent</h1>
          <p className="text-emerald-100 text-lg">Karthik's academic performance is looking great!</p>
        </div>
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30 text-center">
          <p className="text-sm font-medium uppercase tracking-wider">Attendance</p>
          <p className="text-4xl font-bold">96%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500"/> Recent Grades</h2>
          <div className="space-y-4">
             <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
               <span className="font-bold text-gray-700">Mathematics</span>
               <span className="font-bold text-emerald-600">A+</span>
             </div>
             <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
               <span className="font-bold text-gray-700">Science</span>
               <span className="font-bold text-emerald-600">A</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-rose-500"/> Pending Homeworks</h2>
          <div className="p-4 border border-rose-100 bg-rose-50 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">Science Diagram</p>
              <p className="text-sm text-gray-600">Due tomorrow</p>
            </div>
            <button className="text-rose-600 font-bold hover:underline">Remind Karthik</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ParentDashboard;
