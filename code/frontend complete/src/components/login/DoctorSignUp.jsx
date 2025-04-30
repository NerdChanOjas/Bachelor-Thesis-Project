import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function DoctorSignUp() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization *</Label>
          <Input id="specialization" placeholder="Enter your specialization" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number *</Label>
          <Input id="licenseNumber" placeholder="Enter your license number" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Experience (years) *</Label>
        <Input id="experience" type="number" placeholder="Enter years of experience" required />
      </div>
    </div>
  );
}

