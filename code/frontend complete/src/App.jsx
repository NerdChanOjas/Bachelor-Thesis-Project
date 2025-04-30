import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSignUp from './pages/Login/SignInSignUpPage';
import SignIn from './pages/Login/SignIn';
import SignUp from './pages/Login/SignUp';
import OTPVerification from './pages/Login/OTPVerification';
import ProviderDashboard from './pages/Provder/ProviderDashboard';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/Doctor/DoctorPatientsPage';
import DoctorChatbotPage from './pages/Doctor/DoctorChatbotPage';
import DoctorReportsPage from './pages/Doctor/DoctorReportsPage';

import PatientDashboard from './pages/Patient/PatientDashboard';
import SymptomCheckerPage from './pages/Patient/SymptomCheckerPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/symptom-checker" element={<SymptomCheckerPage />} />

      <Route path="/login" element={<SignInSignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/provider" element={<ProviderDashboard />} />

        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
        <Route path="/doctor/chatbot" element={<DoctorChatbotPage />} />
        <Route path="/doctor/reports" element={<DoctorReportsPage />} />

        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
