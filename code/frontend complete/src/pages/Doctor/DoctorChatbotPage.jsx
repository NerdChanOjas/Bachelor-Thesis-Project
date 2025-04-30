import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import DoctorChatbot from '../../components/doctor/DoctorChatbot';

export default function DoctorChatbotPage() {
  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Chatbot</h1>
        <DoctorChatbot />
      </main>
    </div>
  );
}

