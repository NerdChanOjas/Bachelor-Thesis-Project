import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ProviderSignUp() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workType">Work Type *</Label>
        <Input id="workType" placeholder="Enter your work type" required />
      </div>
    </div>
  );
}
