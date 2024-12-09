import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Jan', cholesterol: 200, bloodPressure: 120 },
  { name: 'Feb', cholesterol: 190, bloodPressure: 118 },
  { name: 'Mar', cholesterol: 185, bloodPressure: 115 },
  { name: 'Apr', cholesterol: 180, bloodPressure: 112 },
  { name: 'May', cholesterol: 175, bloodPressure: 110 },
];

// Mock function to check if a report is available
const isReportAvailable = (patient) => {
  // In a real app, this would check against actual patient data
  return patient.urgency !== 'New';
};

// Mock data for the most recent report
const mostRecentReport = {
  name: "Blood Test Results",
  date: "2023-06-01",
  file: "blood_test_2023_06_01.pdf"
};

export default function ReportAnalysis({ patient }) {
  const handleDownload = (file) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading file: ${file}`);
  };

  const handleView = (file) => {
    // In a real application, this would open the file for viewing
    console.log(`Viewing file: ${file}`);
  };

  if (!isReportAvailable(patient)) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No report available at the moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Report Analysis</CardTitle>
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
            <Line yAxisId="left" type="monotone" dataKey="cholesterol" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="bloodPressure" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Patient's cholesterol levels have been steadily decreasing over the past few months, 
            indicating a positive response to the prescribed treatment. Blood pressure has also 
            shown improvement, but continued monitoring is recommended.
          </p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Most Recent Report</h3>
          <div className="flex justify-between items-center">
            <div>
              <p>{mostRecentReport.name}</p>
              <p className="text-sm text-muted-foreground">{mostRecentReport.date}</p>
            </div>
            <div>
              <Button onClick={() => handleDownload(mostRecentReport.file)} className="mr-2">Download</Button>
              <Button onClick={() => handleView(mostRecentReport.file)} variant="outline">View</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

