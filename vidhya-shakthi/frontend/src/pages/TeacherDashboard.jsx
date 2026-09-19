import React from 'react';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';

const TeacherDashboard = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Teacher!</h1>
          <p className="text-gray-500">Here's your schedule for today.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:bg-indigo-700">Assign Homework</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Class 10 - A</h3>
               <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-lg">9:00 AM</span>
             </div>
             <p className="text-sm text-gray-500 mb-4">Subject: Science</p>
             <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200">Take Attendance</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
