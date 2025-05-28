// THIS IS USER PROFILE
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  Search,
  Plus,
  Bell,
  FileText,
  Download,
  MoreHorizontal,
  ChevronRight,
  StickyNote,
  BookOpen,
  GraduationCap,
  Edit2,
  Upload,
} from "lucide-react"
import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import UserProfileClient from "./UserProfileClient"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { userDataService } from "@/app/api/profile/userDataService"
import { UserData } from "@/app/api/profile/userDataService"

// Mock data for skills
const mockSkills = {
  canTeach: [
    { name: "Python Programming", level: "Advanced", category: "Programming" },
    { name: "Web Development", level: "Intermediate", category: "Programming" },
    { name: "Digital Marketing", level: "Expert", category: "Marketing" },
  ],
  wantToLearn: [
    { name: "UI/UX Design", level: "Beginner", category: "Design" },
    { name: "Data Science", level: "Intermediate", category: "Programming" },
    { name: "Spanish Language", level: "Beginner", category: "Language" },
  ],
}

// Mock data for skill exchanges
const mockExchanges = {
  upcoming: [
    {
      id: 1,
      date: "26 Nov '23",
      time: "10:00-11:00",
      title: "Python Programming Session",
      partner: "John Smith",
      location: "Online",
      status: "Scheduled",
      type: "Teaching",
    },
    {
      id: 2,
      date: "28 Nov '23",
      time: "14:00-15:00",
      title: "UI/UX Design Learning",
      partner: "Sarah Johnson",
      location: "Online",
      status: "Scheduled",
      type: "Learning",
    },
  ],
  past: [
    {
      id: 3,
      date: "20 Nov '23",
      time: "10:00-11:00",
      title: "Web Development Teaching",
      partner: "Mike Brown",
      location: "Online",
      status: "Completed",
      type: "Teaching",
      rating: 4.5,
    },
    {
      id: 4,
      date: "15 Nov '23",
      time: "14:00-15:00",
      title: "Digital Marketing Session",
      partner: "Emma Wilson",
      location: "Online",
      status: "Completed",
      type: "Teaching",
      rating: 5,
    },
  ],
  owed: [
    {
      id: 5,
      date: "30 Nov '23",
      time: "11:00-12:00",
      title: "Data Science Learning",
      partner: "Alex Chen",
      location: "Online",
      status: "Pending",
      type: "Learning",
    },
  ],
}

// Mock data for calendar
const mockCalendarData = {
  upcoming: [
    { date: new Date(2024, 2, 15), title: "Python Programming Session", partner: "John Smith", type: "Teaching" },
    { date: new Date(2024, 2, 18), title: "UI/UX Design Learning", partner: "Sarah Johnson", type: "Learning" },
    { date: new Date(2024, 2, 20), title: "Web Development Teaching", partner: "Mike Brown", type: "Teaching" },
  ],
  past: [
    { date: new Date(2024, 1, 15), title: "Digital Marketing Session", partner: "Emma Wilson", type: "Teaching", rating: 5 },
    { date: new Date(2024, 1, 10), title: "Data Science Learning", partner: "Alex Chen", type: "Learning", rating: 4.5 },
  ]
}

export default async function UserProfile({ params }: { params: { id: string } }) {
  const userId = params.id;
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <div className="h-full w-full">
        <div className="h-full bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Skill Swap</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {[
                    { icon: Users, label: "Overview", active: true },
                    { icon: Users, label: "Calendar" },
                    { icon: MessageSquare, label: "Messages" },
                  ].map((item, index) => (
                    <NavItem key={index} {...item} />
                  ))}
                </div>
              </nav>

              {/* Bottom User */}
              <div className="p-4 border-t border-gray-200">
                <UserProfileClient 
                  userId={userId}
                  initialSkills={mockSkills}
                  initialCalendarData={mockCalendarData}
                  showSidebarUser={true}
                />
              </div>
            </div>

            {/* Main Content */}
            <UserProfileClient 
              userId={userId}
              initialSkills={mockSkills}
              initialCalendarData={mockCalendarData}
              showSidebarUser={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function TreatmentItem({
  date,
  time,
  title,
  doctor,
  location,
  status,
}: {
  date: string
  time: string
  title: string
  doctor: string
  location: string
  status: string
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium text-gray-900">{date}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{doctor}</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            {status}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function FileItem({
  name,
  size,
  icon: Icon,
  hasActions = false,
}: {
  name: string
  size: string
  icon: any
  hasActions?: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <Icon className="w-5 h-5 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {size && <p className="text-xs text-gray-500">{size}</p>}
      </div>
      {hasActions && (
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="w-6 h-6">
            <Download className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="w-6 h-6">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
