import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bell, FileText, Settings, Users, MessageSquare } from 'lucide-react';
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { title: "Dashboard", href: "/doctor", icon: LayoutDashboard },
  { title: "Patients", href: "/doctor/patients", icon: Users },
  { title: "Reports", href: "/doctor/reports", icon: FileText },
  { title: "Chatbot", href: "/doctor/chatbot", icon: MessageSquare },
];

export default function DoctorSidebar() {
  const location = useLocation();

  return (
    <nav className="w-64 bg-muted/50 p-4 hidden md:block">
      <div className="space-y-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              location.pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}

