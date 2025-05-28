"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, ChevronRight, Search, Plus, Bell, Edit2, Upload, Star, GraduationCap, BookOpen } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { userDataService } from "@/app/api/profile/userDataService"
import { UserData } from "@/app/api/profile/userDataService"
import { useRouter } from "next/navigation"

interface UserProfileClientProps {
  userId: string
  initialSkills: {
    canTeach: Array<{ name: string; level: string; category: string }>
    wantToLearn: Array<{ name: string; level: string; category: string }>
  }
  initialCalendarData: {
    upcoming: Array<{ date: Date; title: string; partner: string; type: string }>
    past: Array<{ date: Date; title: string; partner: string; type: string; rating: number }>
  }
  showSidebarUser?: boolean
}

export default function UserProfileClient({ userId, initialSkills, initialCalendarData, showSidebarUser = false }: UserProfileClientProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [skills, setSkills] = useState(initialSkills)
  const [calendarData] = useState(initialCalendarData)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized')
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If no user is logged in, redirect to login page
        router.push('/modern/login')
        return
      }

      setFirebaseUser(user)
      try {
        const data = await userDataService.getUser(user.uid)
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const getUserDisplayName = (userData: UserData | null, firebaseUser: FirebaseUser | null) => {
    if (userData?.firstName && userData?.surname) {
      return `${userData.firstName} ${userData.surname}`
    }
    return firebaseUser?.displayName || 'User'
  }

  const getUserInitials = (userData: UserData | null, firebaseUser: FirebaseUser | null) => {
    const name = getUserDisplayName(userData, firebaseUser)
    return name.split(' ').map((n: string) => n[0]).join('')
  }

  if (showSidebarUser) {
    if (isLoading || !firebaseUser || !userData) {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Loading...</p>
            <p className="text-xs text-gray-500">Member</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={userData.profilePicture || firebaseUser.photoURL || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{getUserInitials(userData, firebaseUser)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{getUserDisplayName(userData, firebaseUser)}</p>
          <p className="text-xs text-gray-500">Member</p>
        </div>
      </div>
    )
  }

  if (isLoading || !firebaseUser || !userData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>User Profile</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{getUserDisplayName(userData, firebaseUser)}</span>
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
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50/80" onClick={() => setIsEditingProfile(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* User Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* User Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-white shadow-xl">
                <AvatarImage src={userData.profilePicture || firebaseUser.photoURL || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{getUserInitials(userData, firebaseUser)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="ghost"
                className="absolute bottom-0 right-0 bg-white rounded-full shadow-md hover:bg-gray-100"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      try {
                        const reader = new FileReader()
                        reader.onload = async (e) => {
                          const imageUrl = e.target?.result as string
                          // Update user data with new image
                          await userDataService.updateProfilePicture(firebaseUser.uid, imageUrl)
                          setUserData(prev => prev ? { ...prev, profilePicture: imageUrl } : null)
                        }
                        reader.readAsDataURL(file)
                      } catch (error) {
                        console.error('Error updating profile image:', error)
                      }
                    }
                  }
                  input.click()
                }}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">{getUserDisplayName(userData, firebaseUser)}</h1>
                {isEditingProfile && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                )}
              </div>
              <p className="text-gray-600 mb-4">Skill Exchange Profile</p>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  {isEditingProfile ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        defaultValue={userData.location || ''} 
                        className="w-full"
                        onChange={(e) => {
                          if (userData) {
                            setUserData({ ...userData, location: e.target.value })
                          }
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={async () => {
                          if (userData && firebaseUser) {
                            try {
                              await userDataService.updateLocation(firebaseUser.uid, userData.location || '')
                              setIsEditingProfile(false)
                            } catch (error) {
                              console.error('Error updating location:', error)
                            }
                          }
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{userData.location || 'Not specified'}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-sm font-medium">{new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Skills I Can Teach
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSkills(!isEditingSkills)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      {isEditingSkills ? "Save" : "Edit"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {skills.canTeach.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        {isEditingSkills ? (
                          <>
                            <Input defaultValue={skill.name} className="w-1/2" />
                            <Input defaultValue={skill.level} className="w-1/4" />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => {
                                const newSkills = { ...skills }
                                newSkills.canTeach = skills.canTeach.filter((_, i) => i !== index)
                                setSkills(newSkills)
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium">{skill.name}</p>
                              <p className="text-xs text-gray-500">{skill.category}</p>
                            </div>
                            <Badge variant="outline" className="bg-white/50">{skill.level}</Badge>
                          </>
                        )}
                      </div>
                    ))}
                    {isEditingSkills && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const newSkills = { ...skills }
                          newSkills.canTeach.push({ name: "New Skill", level: "Beginner", category: "Other" })
                          setSkills(newSkills)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Skills I Want to Learn
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSkills(!isEditingSkills)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      {isEditingSkills ? "Save" : "Edit"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {skills.wantToLearn.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        {isEditingSkills ? (
                          <>
                            <Input defaultValue={skill.name} className="w-1/2" />
                            <Input defaultValue={skill.level} className="w-1/4" />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => {
                                const newSkills = { ...skills }
                                newSkills.wantToLearn = skills.wantToLearn.filter((_, i) => i !== index)
                                setSkills(newSkills)
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium">{skill.name}</p>
                              <p className="text-xs text-gray-500">{skill.category}</p>
                            </div>
                            <Badge variant="outline" className="bg-white/50">{skill.level}</Badge>
                          </>
                        )}
                      </div>
                    ))}
                    {isEditingSkills && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const newSkills = { ...skills }
                          newSkills.wantToLearn.push({ name: "New Skill", level: "Beginner", category: "Other" })
                          setSkills(newSkills)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg shadow-gray-200/50 border border-gray-200/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Calendar</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Upcoming Sessions</h4>
                    <div className="space-y-2">
                      {calendarData.upcoming.map((session, index) => (
                        <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-sm">
                          <CardContent className="p-3">
                            <p className="text-sm font-medium">{format(session.date, "MMM d, yyyy")}</p>
                            <p className="text-sm text-gray-600">{session.title}</p>
                            <p className="text-xs text-gray-500">with {session.partner}</p>
                            <Badge variant={session.type === "Teaching" ? "default" : "secondary"} className="mt-1">
                              {session.type}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Past Sessions</h4>
                    <div className="space-y-2">
                      {calendarData.past.map((session, index) => (
                        <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-sm">
                          <CardContent className="p-3">
                            <p className="text-sm font-medium">{format(session.date, "MMM d, yyyy")}</p>
                            <p className="text-sm text-gray-600">{session.title}</p>
                            <p className="text-xs text-gray-500">with {session.partner}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={session.type === "Teaching" ? "default" : "secondary"}>
                                {session.type}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs">{session.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
          </div>
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