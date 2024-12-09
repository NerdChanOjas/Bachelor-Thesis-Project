import { useState } from "react";
import { Send, Upload, File } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Here you would typically send the message to your backend for processing
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I've received your message. How else can I help?", sender: "bot" }]);
      }, 1000);
      setInput("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles([...uploadedFiles, file]);
      setMessages([...messages, { text: `File uploaded: ${file.name}`, sender: "user" }]);
      // Here you would typically send the file to your backend for processing
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `I've received your file: ${file.name}. How can I help you with this document?`, sender: "bot" }]);
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
          />
          <label htmlFor="chat-file-upload">
            <Button type="button" size="icon" variant="outline" as="span">
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
              <span className="truncate max-w-[100px]">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}


