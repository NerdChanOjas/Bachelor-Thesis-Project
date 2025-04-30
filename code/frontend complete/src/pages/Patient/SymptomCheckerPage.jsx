import React from 'react';
import SymptomChecker from '../../components/patient/SymptomChecker';
import DashboardSidebar from '../../components/patient/DashboardSidebar';

export default function SymptomCheckerPage() {
  return (
    <div className="flex bg-background min-h-screen">
      <DashboardSidebar />
      {/* <main className="flex-1 overflow-y-auto p-6"> */}
      <main className="flex-1 container mx-auto p-4">
        <SymptomChecker />
      </main>
    </div>
  );
}

