import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Eye, FileText } from 'lucide-react';
import DashboardSidebar from "../../components/patient/DashboardSidebar";

// Mock function to fetch patient reports
const fetchPatientReports = () => [
  { id: 1, name: "Blood Test Results", date: "2023-06-01", analysis: "Normal results across all parameters.", file: "blood_test_2023_06_01.pdf" },
  { id: 2, name: "X-Ray Report", date: "2023-05-15", analysis: "No abnormalities detected in chest X-ray.", file: "x_ray_2023_05_15.pdf" },
  { id: 3, name: "Annual Physical", date: "2023-04-01", analysis: "Overall health is good. Recommended lifestyle changes discussed.", file: "annual_physical_2023_04_01.pdf" },
  { id: 4, name: "MRI Scan", date: "2023-03-10", analysis: "No significant findings in brain MRI.", file: "mri_scan_2023_03_10.pdf" },
  { id: 5, name: "Cholesterol Test", date: "2023-02-20", analysis: "Cholesterol levels within normal range.", file: "cholesterol_test_2023_02_20.pdf" },
];

export default function MedicalHistoryPage() {
  const reports = fetchPatientReports();

  const handleViewReport = (file) => {
    // In a real application, this would open the file in a new tab
    window.open(`/reports/${file}`, '_blank');
  };

  return (
    <div className="flex bg-background min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Medical History</h1>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report.file)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                  <p className="text-sm mt-2"><span className="font-medium">Analysis:</span> {report.analysis}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

