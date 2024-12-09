import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PersonalProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" alt="Patient" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">Age: 35</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Health Summary</h3>
          <p className="text-sm text-muted-foreground">Generally healthy, regular check-ups advised</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Recent Activities</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>Blood test (2 days ago)</li>
            <li>Dentist appointment (1 week ago)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

