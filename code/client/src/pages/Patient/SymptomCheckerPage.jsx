import React from 'react';
import SymptomChecker from '../../components/patient/SymptomChecker';
import DashboardSidebar from '../../components/patient/DashboardSidebar';

export default function SymptomCheckerPage() {
  return (
    <div className="flex min-h-screen bg-background">
    <DashboardSidebar />
    <main className="flex-1 overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Symptom Checker</h1>
      <SymptomChecker />
    </main>
  </div>
  );
}

