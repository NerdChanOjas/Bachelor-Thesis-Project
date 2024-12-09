import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function UrgencyLevel({ urgency }) {
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
        <CardTitle>Urgency Level</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${getUrgencyColor(urgency)}`}>
          {urgency}
        </p>
      </CardContent>
    </Card>
  );
}

