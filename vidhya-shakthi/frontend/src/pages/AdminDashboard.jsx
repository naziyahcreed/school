import React from 'react';
import { BarChart2, Users, Activity, FileText } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500 mt-1">Overview of school performance and metrics.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-gray-50">Generate Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "1,245", trend: "+12", color: "text-blue-600" },
          { label: "Total Teachers", value: "84", trend: "0", color: "text-indigo-600" },
          { label: "Avg Attendance", value: "92.4%", trend: "+1.2%", color: "text-emerald-600" },
          { label: "Active Alerts", value: "3", trend: "-2", color: "text-rose-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-gray-500 font-medium text-sm">{stat.label}</h3>
            <div className="mt-4 flex items-end justify-between">
              <span className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</span>
              <span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500"/> Academic Health Map</h2>
          <div className="h-72 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl border border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-medium">[Chart Placeholder: Recharts / Chart.js]</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-rose-500"/> Recent Absences</h2>
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm">S{i}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Student Name {i}</p>
                    <p className="text-xs text-gray-500">Std 10 - A</p>
                  </div>
                </div>
                <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200">Alert Sent</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
