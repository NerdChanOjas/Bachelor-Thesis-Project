import { useState } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";

// Mock data for patient reports
const patientReports = [
  {
    id: 1,
    name: "John Doe",
    reports: [
      { id: 1, name: "Blood Test", date: "2023-06-01", file: "blood_test.pdf" },
      { id: 2, name: "X-Ray", date: "2023-05-15", file: "x_ray.pdf" },
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    reports: [
      { id: 3, name: "MRI Scan", date: "2023-06-02", file: "mri_scan.pdf" },
    ]
  },
  // Add more patients as needed
];

export default function DoctorReportsPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleDownload = (file) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading file: ${file}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Patient Reports</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patientReports.map(patient => (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardHeader>
                <CardTitle>{patient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.reports.length} report(s)</p>
                <p>Latest: {patient.reports[0].date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedPatient && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedPatient.name}'s Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {selectedPatient.reports.map(report => (
                  <div key={report.id} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Button onClick={() => handleDownload(report.file)}>Download</Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

