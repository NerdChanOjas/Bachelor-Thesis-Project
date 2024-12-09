import React, { useState, useCallback } from "react";
import { FileText, Upload, AlertCircle, Eye, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Link } from 'react-router-dom';

// Mock functions to simulate fetching data
const fetchLatestReport = () => ({
  id: 1,
  name: "Blood Test Results",
  date: "2023-06-01",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
});

const analyzeReport = () => "Based on your latest blood work, your cholesterol levels have improved. Keep up the good work with your diet and exercise routine!";

const fetchAllReports = () => [
  { id: 1, name: "Blood Test Results", date: "2023-06-01", summary: "Normal results across all parameters.", file: "blood_test_2023_06_01.pdf" },
  { id: 2, name: "X-Ray Report", date: "2023-05-15", summary: "No abnormalities detected in chest X-ray.", file: "x_ray_2023_05_15.pdf" },
  { id: 3, name: "Annual Physical", date: "2023-04-01", summary: "Overall health is good. Recommended lifestyle changes discussed.", file: "annual_physical_2023_04_01.pdf" },
  { id: 4, name: "MRI Scan", date: "2023-03-10", summary: "No significant findings in brain MRI.", file: "mri_scan_2023_03_10.pdf" },
  { id: 5, name: "Cholesterol Test", date: "2023-02-20", summary: "Cholesterol levels within normal range.", file: "cholesterol_test_2023_02_20.pdf" },
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function QuickActions() {
  const [documents, setDocuments] = useState(fetchAllReports());
  const [latestReport, setLatestReport] = useState(fetchLatestReport());
  const [analysis, setAnalysis] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleUpload = () => {
    if (uploadedFile) {
      const newDocument = {
        id: documents.length + 1,
        name: uploadedFile.name,
        date: new Date().toISOString().split('T')[0],
        summary: "Uploaded by user. Analysis pending.",
        file: uploadedFile.name,
      };
      setDocuments([newDocument, ...documents]);
      setUploadedFile(null);
    }
  };

  const handleAnalysis = () => {
    setAnalysis(analyzeReport());
  };

  const handleViewReport = (file) => {
    // In a real application, this would open the file in a new tab
    window.open(`/reports/${file}`, '_blank');
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
              View Recent Documents
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Your Recent Documents</DialogTitle>
              <DialogDescription>
                {documents.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {documents.slice(0, 5).map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center text-sm border p-2 rounded">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-muted-foreground">{doc.date}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewReport(doc.file)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Link to="/medical-history" className="text-primary hover:underline">
                        View Full Medical History
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p>No documents available.</p>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium">
                Drag and drop file here or click to upload
              </p>
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({formatFileSize(uploadedFile.size)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

