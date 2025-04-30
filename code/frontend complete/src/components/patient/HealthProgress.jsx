import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', weight: 70, bloodPressure: 120, sugarLevel: 100 },
  { name: 'Feb', weight: 69, bloodPressure: 118, sugarLevel: 98 },
  { name: 'Mar', weight: 68, bloodPressure: 116, sugarLevel: 97 },
  { name: 'Apr', weight: 68, bloodPressure: 115, sugarLevel: 96 },
  { name: 'May', weight: 67, bloodPressure: 114, sugarLevel: 95 },
];

export default function HealthProgress() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Health Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="bloodPressure" stroke="#82ca9d" />
            <Line yAxisId="right" type="monotone" dataKey="sugarLevel" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

