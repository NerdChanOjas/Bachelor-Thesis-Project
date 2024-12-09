import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Mock data for doctors
const doctors = [
  { id: 1, name: "Dr. John Doe", specialty: "General Physician", photo: "/placeholder.svg?height=100&width=100", experience: "10 years", timings: "Tues, Thurs 12pm to 6pm" },
  { id: 2, name: "Dr. Jane Smith", specialty: "Orthopedic", photo: "/placeholder.svg?height=100&width=100", experience: "15 years", timings: "Mon, Wed, Fri 9am to 3pm" },
  { id: 3, name: "Dr. Mike Johnson", specialty: "Cardiologist", photo: "/placeholder.svg?height=100&width=100", experience: "12 years", timings: "Mon, Tues, Thurs 10am to 4pm" },
];

// Mock function to determine doctor specialty based on symptoms
const determineSpecialty = (symptoms) => {
  const lowercaseSymptoms = symptoms.toLowerCase();
  if (lowercaseSymptoms.includes("heart") || lowercaseSymptoms.includes("chest pain")) {
    return "Cardiologist";
  } else if (lowercaseSymptoms.includes("bone") || lowercaseSymptoms.includes("joint")) {
    return "Orthopedic";
  } else {
    return "General Physician";
  }
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [recommendedSpecialty, setRecommendedSpecialty] = useState("");
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [tempSelectedDoctor, setTempSelectedDoctor] = useState(null);
  const [symptomsChecked, setSymptomsChecked] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const specialty = determineSpecialty(symptoms);
    setRecommendedSpecialty(specialty);
    setRecommendedDoctors(doctors.filter(doctor => doctor.specialty === specialty));
    setSymptomsChecked(true);
  }, [symptoms]);

  const handleSelectDoctor = useCallback((doctor) => {
    setTempSelectedDoctor(doctor);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    setSelectedDoctor(tempSelectedDoctor);
    setIsConfirmDialogOpen(false);
    // Here you would typically update the backend with the selected doctor
    console.log(`Selected doctor: ${tempSelectedDoctor.name}`);
  }, [tempSelectedDoctor]);

  const handleCancelSelection = useCallback(() => {
    setTempSelectedDoctor(null);
    setIsConfirmDialogOpen(false);
  }, []);

  const handleCancelAppointment = useCallback(() => {
    setSelectedDoctor(null);
    setSymptomsChecked(false);
    setSymptoms('');
    setRecommendedSpecialty('');
    setRecommendedDoctors([]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Symptom Checker</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <Label htmlFor="symptoms">Describe your symptoms:</Label>
        <Textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full mb-4"
          rows={4}
        />
        <Button type="submit" disabled={!symptoms.trim() || selectedDoctor !== null}>
          Check Symptoms
        </Button>
      </form>

      {recommendedSpecialty && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recommended Specialty: {recommendedSpecialty}</h2>
          <p>Based on your symptoms, we recommend consulting a {recommendedSpecialty}.</p>
        </div>
      )}

      {recommendedDoctors.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Doctors:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedDoctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardHeader>
                  <CardTitle>{doctor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full mb-2" />
                  <p><strong>Specialty:</strong> {doctor.specialty}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  <p><strong>Timings:</strong> {doctor.timings}</p>
                  <Button 
                    onClick={() => handleSelectDoctor(doctor)} 
                    disabled={selectedDoctor !== null || !symptomsChecked}
                    className="mt-2"
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedDoctor && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Selected Doctor:</h2>
          <Card>
            <CardHeader>
              <CardTitle>{selectedDoctor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
              <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
              <p><strong>Timings:</strong> {selectedDoctor.timings}</p>
              <Button 
                onClick={handleCancelAppointment}
                variant="destructive"
                className="mt-2"
              >
                Cancel Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Doctor Selection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to select Dr. {tempSelectedDoctor?.name}? You can only select one doctor at a time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSelection}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSelection}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

