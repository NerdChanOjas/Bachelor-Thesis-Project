import DashboardSidebar from '../../components/patient/DashboardSidebar';
import PersonalProfile from '../../components/patient/PersonalProfile';
import QuickActions from '../../components/patient/QuickActions';
import HealthProgress from '../../components/patient/HealthProgress';
// import ChatbotInterface from '../../components/patient/ChatbotInterface';
import DailyTip from '../../components/patient/DailyTip';

export default function Dashboard() {

  return (
    <div className="flex h-vh bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PersonalProfile />
          <QuickActions />
          <DailyTip />
          {/* <HealthProgress /> */}
          <HealthProgress className="col-span-full" />
        </div>
        {/* <ChatbotInterface /> */}
      </main>
    </div>
  );
}

