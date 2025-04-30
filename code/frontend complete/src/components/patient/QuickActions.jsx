import React, { useState } from "react";
import { FileText, Upload, AlertCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// Mock functions to simulate fetching data
const fetchLatestReport = () => ({
  id: 1,
  name: "Blood Test Results",
  date: "2023-06-01",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
});

const analyzeReport = () => "Based on your latest blood work, your cholesterol levels have improved. Keep up the good work with your diet and exercise routine!";

const fetchAllReports = () => [
  { id: 1, name: "Blood Test Results", date: "2023-06-01", summary: "Normal results across all parameters." },
  { id: 2, name: "X-Ray Report", date: "2023-05-15", summary: "No abnormalities detected in chest X-ray." },
  { id: 3, name: "Annual Physical", date: "2023-04-01", summary: "Overall health is good. Recommended lifestyle changes discussed." },
];

export default function QuickActions() {
  const [documents, setDocuments] = useState(fetchAllReports());
  const [latestReport, setLatestReport] = useState(fetchLatestReport());
  const [analysis, setAnalysis] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDocument = {
        id: documents.length + 1,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        summary: "Uploaded by user. Analysis pending.",
      };
      setDocuments([newDocument, ...documents]);
    }
  };

  const handleAnalysis = () => {
    setAnalysis(analyzeReport());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Latest Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{latestReport.name}</DialogTitle>
              <DialogDescription>
                <p>Date: {latestReport.date}</p>
                <p className="mt-2">{latestReport.content}</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" onClick={handleAnalysis}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Analysis of Latest Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Latest Report Analysis</DialogTitle>
              <DialogDescription>{analysis}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View All Reports
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Your Reports</DialogTitle>
              <DialogDescription>
                {documents.length > 0 ? (
                  <div className="mt-4 space-y-6">
                    {/* {Object.groupBy(documents, doc => doc.date.split('-')[1]).map(([month, docs]) => (
                      <div key={month}>
                        <h3 className="font-semibold mb-2">{new Date(docs[0].date).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <ul className="space-y-2">
                          {docs.map((doc) => (
                            <li key={doc.id} className="text-sm border p-2 rounded">
                              <p className="font-medium">{doc.name} - {doc.date}</p>
                              <p className="text-muted-foreground">{doc.summary}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))} */}
                    
                  </div>
                ) : (
                  <p>No reports available.</p>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div>
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button className="w-full cursor-pointer" as="span">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

