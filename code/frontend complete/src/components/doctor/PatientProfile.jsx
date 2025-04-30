import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function PatientProfile({ selectedPatient, onUrgencyChange }) {
  const [urgency, setUrgency] = useState(selectedPatient.urgency);

  // Mock medical history data
  const medicalHistory = [
    { date: "2023-05-15", event: "Annual check-up" },
    { date: "2023-03-10", event: "Flu vaccination" },
    { date: "2022-11-22", event: "Sprained ankle" },
    // Add more mock history as needed
  ];

  const handleUrgencyChange = (value) => {
    // setUrgency(value);
    onUrgencyChange(selectedPatient.id, value);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Patient Profile: {selectedPatient.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Last Visit</h3>
            <p>{selectedPatient.lastVisit}</p>
          </div>
          <div>
            <h3 className="font-semibold">Urgency</h3>
            <Select value={selectedPatient.urgency} onValueChange={handleUrgencyChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <h3 className="font-semibold mb-2">Medical History</h3>
        <ScrollArea className="h-40">
          <ul className="space-y-2">
            {medicalHistory.map((event, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{event.date}:</span> {event.event}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
