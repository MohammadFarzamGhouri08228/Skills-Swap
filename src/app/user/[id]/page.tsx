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
} from "lucide-react"

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
                  <span className="font-semibold text-gray-900">Zendenta</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  <NavItem icon={Calendar} label="Overview" />
                  <NavItem icon={Calendar} label="Calendar" />
                  <NavItem icon={Users} label="Patient List" active />
                  <NavItem icon={MessageSquare} label="Messages" />
                  <NavItem icon={CreditCard} label="Payment Information" />
                  <NavItem icon={Settings} label="Settings" />
                </div>
              </nav>

              {/* Bottom User */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>DA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Dr. Adam H.</p>
                    <p className="text-xs text-gray-500">Doctor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Patient List</span>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-gray-900">Diane Cooper</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input placeholder="Search" className="pl-10 w-64" />
                    </div>
                    <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                    </Button>
                    <Button variant="ghost" className="text-blue-600">
                      Edit Patient
                    </Button>
                  </div>
                </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                {/* Patient Details */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Patient Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Diane Cooper</h1>
                      <p className="text-gray-600 mb-4">Patient Information</p>

                      <div className="grid grid-cols-3 gap-8 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Gender</p>
                          <p className="text-sm font-medium">Female</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Birthday</p>
                          <p className="text-sm font-medium">Feb 24th, 1999</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                          <p className="text-sm font-medium">(555) 555-0108</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Street Address</p>
                          <p className="text-sm font-medium">Jl. Dipanegoro No. 51</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">City</p>
                          <p className="text-sm font-medium">Chicago</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ZIP Code</p>
                          <p className="text-sm font-medium">60649</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">15</p>
                          <p className="text-sm text-gray-500">Visits</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">2</p>
                          <p className="text-sm text-gray-500">Treatments</p>
                        </div>
                        <div className="ml-8">
                          <p className="text-sm text-gray-500 mb-1">Member Status</p>
                          <p className="text-sm font-medium">Active Member</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Registration Date</p>
                          <p className="text-sm font-medium">Feb 24th, 1999</p>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Send Message</Button>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                      <TabsTrigger value="past">Past Appointments</TabsTrigger>
                      <TabsTrigger value="medical">Medical Records</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Root Canal Treatment</CardTitle>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              Show Previous Treatment
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <TreatmentItem
                            date="26 Nov '19"
                            time="10:00-11:00"
                            title="Open Access"
                            doctor="Dr. Adam H."
                            location="Jessicamile"
                            status="Note"
                          />
                          <TreatmentItem
                            date="12 Dec '19"
                            time="10:00-11:00"
                            title="Root Canal prep"
                            doctor="Dr. Adam H."
                            location="Jessicamile"
                            status="Note"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="past">
                      <p className="text-gray-500">Past appointments will be displayed here.</p>
                    </TabsContent>

                    <TabsContent value="medical">
                      <p className="text-gray-500">Medical records will be displayed here.</p>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
                  {/* Notes Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Notes</h3>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        See all
                      </Button>
                    </div>
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          This patient is known to be allergic to some medications.
                        </p>
                        <p className="text-sm text-gray-600 mb-2">Lorem ipsum dolor sit amet consectetur.</p>
                        <p className="text-sm text-gray-600 mb-4">- has allergic history with Oxacillin</p>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          view note
                        </Button>
                      </CardContent>
                    </Card>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Dr. Maya Handoko</span>
                      </div>
                      <span className="text-gray-400">23 Nov '19</span>
                    </div>
                  </div>

                  {/* Files Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Files / Documents</h3>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Files
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <FileItem name="Check Up Result.pdf" size="1.2MB" icon={FileText} />
                      <FileItem name="Dental X-Ray Result 2.pdf" size="" icon={FileText} hasActions />
                      <FileItem name="Medical Prescriptions.pdf" size="8MB" icon={FileText} />
                      <FileItem name="Dental X-Ray Result.pdf" size="" icon={FileText} hasActions />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
