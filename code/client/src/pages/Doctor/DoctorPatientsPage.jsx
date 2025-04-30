import { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import ReportAnalysis from '../../components/doctor/ReportAnalysis';
import Recommendations from '../../components/doctor/Recommendations';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// Mock patient data
const initialPatients = [
  { id: 1, name: "Yash Kanodia", lastVisit: "2023-06-01", urgency: "New" },
  { id: 2, name: "Aditi Dagar", lastVisit: "2023-05-28", urgency: "High" },
  { id: 3, name: "Bhumpreet", lastVisit: "2023-06-02", urgency: "Medium" },
  { id: 4, name: "Chota Bheem", lastVisit: "2023-06-05", urgency: "New" },
];

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    // Simulating fetching updated patient list
    const fetchPatients = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPatients(prevPatients => [
        ...prevPatients,
        { id: 5, name: "Eve Brown", lastVisit: "2023-06-10", urgency: "New" }
      ]);
    };

    fetchPatients();
  }, []);

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id.toString() === patientId);
    setSelectedPatient(patient);
  };

  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Patients</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handlePatientChange}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} - {patient.urgency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {selectedPatient ? (
          <>
            <ReportAnalysis patient={selectedPatient} />
            <Recommendations patient={selectedPatient} />
          </>
        ) : (
          <p className="text-center text-muted-foreground">Select a patient to view their reports and recommendations</p>
        )}
      </main>
    </div>
  );
}
