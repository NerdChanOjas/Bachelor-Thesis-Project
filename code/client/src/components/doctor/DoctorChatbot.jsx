import { useState } from "react";
import { Send, Upload, File } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export default function DoctorChatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello Doctor! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Here you would typically send the message to your backend for processing
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Yash Kanodia, a 36-year-old male, recently experienced a mild heart attack. He stands 176 cm tall and weighs 87 kg, giving him a BMI of approximately 28.1, which classifies him as overweight and indicates a potential risk factor for cardiovascular disease. The occurrence of a cardiac event at his age suggests the need to investigate underlying contributors such as lifestyle factors, stress, genetic predisposition, or conditions like hypertension, diabetes, or hyperlipidemia. Immediate medical intervention should focus on cardiac medications such as antiplatelets, beta-blockers, or statins, alongside a comprehensive lifestyle modification plan emphasizing a heart-healthy diet and weight management. A thorough cardiac evaluation, including tests like an ECG, echocardiogram, and stress test, is essential, along with regular follow-ups to monitor his recovery and implement preventive measures against future episodes.", sender: "bot" }]);
      }, 9000);
      setInput("");
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setMessages([...messages, { text: `Files uploaded: ${newFiles.map(f => f.name).join(', ')}`, sender: "user" }]);
      // Here you would typically send the files to your backend for processing
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `I've received ${newFiles.length} file(s). How can I help you with these documents?`, sender: "bot" }]);
      }, 1000);
    }
  };

  return (
    <Card className="h-[calc(85vh-2rem)]">
      <CardHeader>
        <CardTitle>Medical Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(85vh-12rem)] w-full pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="chat-file-upload"
            multiple
          />
          <label htmlFor="chat-file-upload">
            <Button type="button" size="icon" variant="outline">
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload file</span>
            </Button>
          </label>
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
      {uploadedFiles.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-xs">
              <File className="h-3 w-3 mr-1" />
              {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
