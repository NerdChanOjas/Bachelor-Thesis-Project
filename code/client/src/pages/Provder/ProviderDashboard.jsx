import React, { useState } from 'react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Search, Upload, Eye } from 'lucide-react';

// Mock patient data
const patients = [
  { id: 1, name: "Yash Kanodia", email: "yashkanodia@gmail.com" },
  { id: 2, name: "Aditi Dagar", email: "aditidagar11@gmail.com" },
  // Add more mock patients as needed
];

export default function ProviderDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleViewReport = () => {
    if (uploadedFile) {
      const fileURL = URL.createObjectURL(uploadedFile);
      window.open(fileURL, '_blank');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setUploadedFile(null); // Reset upload state when changing patients
  };

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Provider Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input text-input-foreground"
            />
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {searchTerm && (
            <ul className="mt-2 space-y-2">
              {filteredPatients.map(patient => (
                <li 
                  key={patient.id}
                  className="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground rounded"
                  onClick={() => handlePatientSelect(patient)}
                >
                  {patient.name} - {patient.email}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Report for {selectedPatient.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload Report</Label>
                <div className="mt-1 p-2 border-2 border-input rounded-md ">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-1 border-dashed"
                  />
                </div>
              </div>
              {uploadedFile && (
                <div className="flex items-center space-x-2">
                  <p>Uploaded : {uploadedFile.name}</p>
                  <Button onClick={handleViewReport} size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
