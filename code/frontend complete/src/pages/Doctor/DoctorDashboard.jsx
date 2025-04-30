import { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import PatientList from '../../components/doctor/PatientList';
import PatientProfile from '../../components/doctor/PatientProfile';

// Mock patient data with urgency tracking
const initialPatients = [
  { id: 1, name: "John Doe", lastVisit: "2023-06-01", urgency: "High" },
  { id: 2, name: "Jane Smith", lastVisit: "2023-05-28", urgency: "Low" },
  { id: 3, name: "Alice Johnson", lastVisit: "2023-06-02", urgency: "Medium" },
  { id: 4, name: "Bob Williams", lastVisit: "2023-06-05", urgency: "New" },
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleUrgencyChange = (patientId, newUrgency) => {
    // Update patients array
    const updatedPatients = patients.map(patient => 
      patient.id === patientId ? { ...patient, urgency: newUrgency } : patient
    );
    setPatients(updatedPatients);

    // Update selected patient if it's the same patient
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient({ ...selectedPatient, urgency: newUrgency });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1 lg:col-span-1">
            <PatientList 
              patients={patients} 
              onSelectPatient={setSelectedPatient} 
              onUrgencyChange={handleUrgencyChange}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            {selectedPatient ? (
              <>
                <PatientProfile 
                  selectedPatient={selectedPatient}
                  onUrgencyChange={handleUrgencyChange}
                />
                {/* <ReportAnalysis patient={selectedPatient} />
                <Recommendations patient={selectedPatient} /> */}
              </>
            ) : (
              <p className="text-center text-muted-foreground">Select a patient to view details</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
// import { useState } from 'react';
// import DoctorSidebar from '../components/doctor/DoctorSidebar';
// import PatientList from '../components/doctor/PatientList';
// import PatientProfile from '../components/doctor/PatientProfile';
// import ReportAnalysis from '../components/doctor/ReportAnalysis';
// import Recommendations from '../components/doctor/Recommendations';

// // Mock patient data
// const initialPatients = [
//   { id: 1, name: "John Doe", lastVisit: "2023-06-01", urgency: "High" },
//   { id: 2, name: "Jane Smith", lastVisit: "2023-05-28", urgency: "Low" },
//   { id: 3, name: "Alice Johnson", lastVisit: "2023-06-02", urgency: "Medium" },
//   { id: 4, name: "Bob Williams", lastVisit: "2023-06-05", urgency: "New" },
// ];

// export default function DoctorDashboard() {
//   const [patients, setPatients] = useState(initialPatients);
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   const handleUrgencyChange = (patientId, newUrgency) => {
//     setPatients(patients.map(patient => 
//       patient.id === patientId ? { ...patient, urgency: newUrgency } : patient
//     ));

//     // Update the selectedPatient state
//     if (selectedPatient && selectedPatient.id === patientId) {
//       setSelectedPatient({ ...selectedPatient, urgency: newUrgency });
//     }
//   };

//   return (
//     <div className="flex h-screen bg-background">
//       <DoctorSidebar />
//       <main className="flex-1 overflow-y-auto p-6">
//         <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="md:col-span-1 lg:col-span-1">
//             <PatientList patients={patients} onSelectPatient={setSelectedPatient} onUrgencyChange={handleUrgencyChange}/>
//           </div>
//           <div className="md:col-span-1 lg:col-span-2">
//             {selectedPatient ? (
//               <>
//                 <PatientProfile 
//                   selectedPatient={selectedPatient}
//                   onUrgencyChange={handleUrgencyChange}
//                   urgency={selectedPatient.urgency}
//                 />
//                 {/* <ReportAnalysis patient={selectedPatient} />
//                 <Recommendations patient={selectedPatient} /> */}
//               </>
//             ) : (
//               <p className="text-center text-muted-foreground">Select a patient to view details</p>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }