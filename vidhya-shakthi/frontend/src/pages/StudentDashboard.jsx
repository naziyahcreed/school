import React, { useState } from 'react';
import { BookOpen, Users, Calendar, MessageSquare, Bell, PlayCircle, Book, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Hello, Karthik! 👋</h1>
          <p className="text-blue-100 text-lg">You have 2 pending homeworks and 1 new course assigned today.</p>
        </div>
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-100">Attendance</p>
          <p className="text-4xl font-bold">96%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
        <button onClick={() => setActiveTab('courses')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'courses' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><PlayCircle className="w-5 h-5"/> My Courses</button>
        <button onClick={() => setActiveTab('books')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'books' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><Book className="w-5 h-5"/> Library</button>
        <button onClick={() => setActiveTab('diary')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'diary' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><BookOpen className="w-5 h-5"/> Digital Diary</button>
        <button onClick={() => setActiveTab('chatbot')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'chatbot' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><MessageSquare className="w-5 h-5"/> AI Tutor</button>
      </div>

      {/* Content Area */}
      <div className="mt-4">
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "10th Std Mathematics (Samacheer)", progress: 45, color: "from-pink-500 to-rose-500" },
              { title: "10th Std Science - Physics", progress: 80, color: "from-cyan-500 to-blue-500" },
              { title: "Tamil Grammar Basics", progress: 15, color: "from-amber-500 to-orange-500" }
            ].map((course, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className={`h-32 rounded-2xl bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center`}>
                  <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform"/>
                </div>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{course.title}</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1 font-medium text-gray-500">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-4 flex items-center justify-center">
                  <Book className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="font-bold text-gray-800">Samacheer Std {9 + i}</h3>
                <p className="text-sm text-gray-500 mb-4">PDF Version</p>
                <button className="w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100">Read Now</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'diary' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Homework</h2>
            <div className="space-y-4">
              {[
                { subject: "Mathematics", desc: "Solve Exercise 4.2 in algebra workbook.", due: "Tomorrow" },
                { subject: "Science", desc: "Draw and label the human heart diagram.", due: "Today" }
              ].map((hw, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors bg-slate-50">
                  <div className="flex gap-4 items-center">
                    <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><BookOpen className="w-6 h-6"/></div>
                    <div>
                      <h4 className="font-bold text-gray-800">{hw.subject}</h4>
                      <p className="text-gray-600 text-sm">{hw.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">Due: {hw.due}</span>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">Submit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px] max-w-4xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare /> Vidhya Shakthi AI Tutor</h2>
                <p className="text-indigo-200 text-sm mt-1">Powered by Samacheer Kalvi Database</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Std 10 Science</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-6">
              <div className="flex">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                  <p className="text-gray-800">Vanakkam Karthik! I am your AI Tutor. What would you like to learn today?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                  <p>Can you explain Newton's Third Law with an example?</p>
                </div>
              </div>
              <div className="flex">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                  <p className="text-gray-800 mb-2">Certainly!</p>
                  <p className="text-gray-800">Newton's Third Law states: <strong>"For every action, there is an equal and opposite reaction."</strong></p>
                  <div className="mt-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-900 font-medium">📖 Example from your book:</p>
                    <p className="text-sm text-indigo-800 mt-1">When you swim, you push the water backward (action). The water pushes you forward (reaction) with equal force, allowing you to move.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input type="text" placeholder="Type your question..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">Ask</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
