import { useState } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function PatientSignUp() {
  const [emergencyContact, setEmergencyContact] = useState('');

  const handleEmergencyContactChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setEmergencyContact(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group *</Label>
          <Select required>
            <SelectTrigger id="bloodGroup">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input id="allergies" placeholder="Enter any allergies" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chronicCondition">Chronic Condition</Label>
          <Input id="chronicCondition" placeholder="Enter any chronic conditions" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact *</Label>
          <Input 
            id="emergencyContact" 
            type="text" 
            placeholder="Enter emergency contact number" 
            value={emergencyContact}
            onChange={handleEmergencyContactChange}
            required
            minLength={10}
            maxLength={10}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input id="address" placeholder="Enter your address" required />
      </div>
    </div>
  );
}

