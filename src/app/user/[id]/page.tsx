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
  Star,
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
} from "lucide-react"

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

export default async function UserProfile({ params }: { params: { id: string } }) {
  const userId = params.id;
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-full w-full">
        <div className="h-full bg-white/95 backdrop-blur-sm rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 overflow-hidden">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col h-full shadow-[4px_0_15px_rgba(0,0,0,0.05)]">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Zendenta</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {[
                    { icon: Calendar, label: "Overview" },
                    { icon: Calendar, label: "Calendar" },
                    { icon: Users, label: "Patient List", active: true },
                    { icon: MessageSquare, label: "Messages" },
                    { icon: Settings, label: "Settings" },
                  ].map((item, index) => (
                    <NavItem key={index} {...item} />
                  ))}
                </div>
              </nav>

              {/* Bottom User */}
              <div className="p-4 border-t border-gray-200/50 bg-gradient-to-t from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
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
              <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 flex-shrink-0 shadow-sm">
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
                      <Input placeholder="Search" className="pl-10 w-64 shadow-sm" />
                    </div>
                    <Button size="icon" className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="relative hover:bg-gray-100/80">
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs shadow-sm"></span>
                    </Button>
                    <Button variant="ghost" className="text-blue-600 hover:bg-blue-50/80">
                      Edit Patient
                    </Button>
                  </div>
                </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                {/* Patient Details */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Patient Header - Updated for Skills Swap */}
                  <div className="flex items-start gap-6 mb-8">
                    <Avatar className="w-20 h-20 ring-4 ring-white shadow-xl">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Diane Cooper</h1>
                      <p className="text-gray-600 mb-4">Skill Exchange Profile</p>

                      <div className="grid grid-cols-3 gap-8 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Location</p>
                          <p className="text-sm font-medium">Chicago, IL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Member Since</p>
                          <p className="text-sm font-medium">Nov 2023</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <p className="text-sm font-medium">4.8 (24 reviews)</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Skills Taught</p>
                          <p className="text-sm font-medium">3</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Skills Learned</p>
                          <p className="text-sm font-medium">2</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Exchange Status</p>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Skills I Can Teach
                          </h3>
                          <div className="space-y-2">
                            {mockSkills.canTeach.map((skill, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div>
                                  <p className="text-sm font-medium">{skill.name}</p>
                                  <p className="text-xs text-gray-500">{skill.category}</p>
                                </div>
                                <Badge variant="outline" className="bg-white/50">{skill.level}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Skills I Want to Learn
                          </h3>
                          <div className="space-y-2">
                            {mockSkills.wantToLearn.map((skill, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div>
                                  <p className="text-sm font-medium">{skill.name}</p>
                                  <p className="text-xs text-gray-500">{skill.category}</p>
                                </div>
                                <Badge variant="outline" className="bg-white/50">{skill.level}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                          <p className="text-2xl font-semibold text-gray-900">15</p>
                          <p className="text-sm text-gray-500">Total Exchanges</p>
                        </div>
                        <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                          <p className="text-2xl font-semibold text-gray-900">3</p>
                          <p className="text-sm text-gray-500">Active Exchanges</p>
                        </div>
                        <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                          <p className="text-2xl font-semibold text-gray-900">1</p>
                          <p className="text-sm text-gray-500">Owed Exchanges</p>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20">
                      Request Exchange
                    </Button>
                  </div>

                  {/* Tabs - Updated for Skill Exchanges */}
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg shadow-lg shadow-gray-200/50 border border-gray-200/50">
                      <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Upcoming Exchanges</TabsTrigger>
                      <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Past Exchanges</TabsTrigger>
                      <TabsTrigger value="owed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Owed Exchanges</TabsTrigger>
                      <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                      {mockExchanges.upcoming.map((exchange) => (
                        <Card key={exchange.id} className="bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-200/50 hover:shadow-xl transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{exchange.title}</CardTitle>
                              <Badge variant={exchange.type === "Teaching" ? "default" : "secondary"} className="shadow-sm">
                                {exchange.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ExchangeItem {...exchange} />
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                      {mockExchanges.past.map((exchange) => (
                        <Card key={exchange.id} className="bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-200/50 hover:shadow-xl transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{exchange.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant={exchange.type === "Teaching" ? "default" : "secondary"} className="shadow-sm">
                                  {exchange.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm">{exchange.rating}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ExchangeItem {...exchange} />
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="owed" className="space-y-4">
                      {mockExchanges.owed.map((exchange) => (
                        <Card key={exchange.id} className="bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-200/50 hover:shadow-xl transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{exchange.title}</CardTitle>
                              <Badge variant="destructive" className="shadow-sm">Owed</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ExchangeItem {...exchange} />
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="reviews">
                      <div className="space-y-4">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-200/50 hover:shadow-xl transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                                <AvatarFallback>JS</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-medium">John Smith</p>
                                    <p className="text-sm text-gray-500">Python Programming</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span>5.0</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Excellent teacher! Very patient and knowledgeable. Would definitely exchange skills again.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 bg-gray-50/80 backdrop-blur-sm border-l border-gray-200/50 p-6 overflow-y-auto shadow-[0_0_15px_rgba(0,0,0,0.05)]">
                  {/* Notes Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Exchange Notes</h3>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50/80">
                        Add Note
                      </Button>
                    </div>
                    <Card className="mb-4 bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-200/50 hover:shadow-xl transition-shadow">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Prefers morning sessions for teaching. Available on weekends for learning.
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          - Good at explaining complex concepts
                        </p>
                        <Button size="sm" className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20">
                          Edit Note
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Exchange Requests Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Exchange Requests</h3>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50/80">
                        <Plus className="w-4 h-4 mr-1" />
                        New Request
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <RequestItem
                        name="Sarah Johnson"
                        skill="UI/UX Design"
                        type="Learning"
                        status="Pending"
                      />
                      <RequestItem
                        name="Mike Brown"
                        skill="Web Development"
                        type="Teaching"
                        status="Accepted"
                      />
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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        active 
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20" 
          : "text-gray-600 hover:bg-gray-100/80 hover:shadow-sm"
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

function ExchangeItem({
  date,
  time,
  title,
  partner,
  location,
  status,
  type,
  rating,
}: {
  date: string
  time: string
  title: string
  partner: string
  location: string
  status: string
  type: string
  rating?: number
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full shadow-lg shadow-blue-500/20"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium text-gray-900">{date}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">with {partner}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{location}</p>
            <Badge variant="outline" className="text-blue-600 border-blue-600 bg-white/50 shadow-sm">
              {status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

function RequestItem({
  name,
  skill,
  type,
  status,
}: {
  name: string
  skill: string
  type: string
  status: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
      <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{skill}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs bg-white/50 shadow-sm">
            {type}
          </Badge>
          <Badge variant={status === "Accepted" ? "default" : "secondary"} className="text-xs shadow-sm">
            {status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
