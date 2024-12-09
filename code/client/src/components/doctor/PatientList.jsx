import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Mock patient data
const patients = [
  { id: 1, name: "John Doe", lastVisit: "2023-06-01", urgency: "High" },
  { id: 2, name: "Jane Smith", lastVisit: "2023-05-28", urgency: "Low" },
  { id: 3, name: "Alice Johnson", lastVisit: "2023-06-02", urgency: "Medium" },
  { id: 4, name: "Bob Williams", lastVisit: "2023-06-03", urgency: "New" }, // Added a patient with "New" urgency
  // Add more mock patients as needed
];

export default function PatientList({ patients, onSelectPatient, onUrgencyChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredPatients = patients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.lastVisit) - new Date(a.lastVisit);
      if (sortBy === 'urgency') {
        const urgencyOrder = { High: 3, Medium: 2, Low: 1, New: 0 }; //Added New to urgencyOrder
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      return 0;
    });
  
    const getUrgencyColor = (level) => {
      switch (level) {
        case 'High':
          return 'text-red-500';
        case 'Medium':
          return 'text-yellow-500';
        case 'Low':
          return 'text-green-500';
        case 'New':
          return 'text-blue-500';
        default:
          return 'text-muted-foreground';
      }
    };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('urgency')}>Sort by Urgency</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="space-y-2">
          {filteredPatients.map(patient => (
            <li 
              key={patient.id}
              className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer"
              onClick={() => onSelectPatient(patient)}
            >
              <span>{patient.name}</span>
              <span className={`text-sm ${getUrgencyColor(patient.urgency)}`}
                onClick={(e)=> {
                  e.stopPropagation();
                  onUrgencyChange(patient.id, patient.urgency);
                }}
                // {/* patient.urgency === 'High' ? 'text-red-500' :
                // patient.urgency === 'Medium' ? 'text-yellow-500' :
                // patient.urgency === 'Low' ? 'text-green-500' :
                // patient.urgency === 'New' ? 'text-blue-500' :
                // 'text-muted-foreground' */}
              // {/* }`} */}
              >
                {patient.urgency}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

