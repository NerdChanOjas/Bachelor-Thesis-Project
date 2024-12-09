import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bell, FileText, Settings, Stethoscope, MessageSquare } from 'lucide-react';
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { title: "Dashboard", href: "/patient", icon: LayoutDashboard },
  { title: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
  // { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Medical History", href: "/medical-history", icon: FileText },
  { title: "Chat with AI", href: "/patient-chatbot", icon: MessageSquare },
  // { title: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar() {
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

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

