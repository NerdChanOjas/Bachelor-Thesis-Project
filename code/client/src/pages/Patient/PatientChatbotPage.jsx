import React from 'react';
import DashboardSidebar from '../../components/patient/DashboardSidebar';
import ChatbotInterface from '../../components/patient/ChatbotInterface';

export default function PatientChatbotPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Personal AI Assistant</h1>
        <ChatbotInterface />
      </main>
    </div>
  );
}

