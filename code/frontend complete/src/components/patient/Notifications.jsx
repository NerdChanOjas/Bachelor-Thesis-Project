import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// Mock function to simulate fetching notifications
const fetchNotifications = () => {
  return [
    { id: 1, message: "New report available: Blood Test Results", date: "2023-06-01" },
    { id: 2, message: "Analysis complete for your recent X-Ray", date: "2023-05-28" },
  ];
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, you'd fetch notifications from an API
    const newNotifications = fetchNotifications();
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.length);
  }, []);

  const handleNotificationClick = () => {
    setUnreadCount(0);
    // In a real app, you'd mark notifications as read in the backend
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className="text-sm">
                    <p>{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new notifications</p>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

