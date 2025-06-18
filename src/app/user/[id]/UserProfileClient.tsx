"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, ChevronRight, Search, Plus, Bell, Edit2, Upload, Star, GraduationCap, BookOpen, X, ChevronLeft, Users } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { userDataService } from "@/app/api/profile/userDataService"
import { UserData } from "@/app/api/profile/userDataService"
import { useRouter } from "next/navigation"
import { skillsService, Skill, SkillCategory } from "@/app/api/skills/skillsService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import PeerRequests from '@/components/peers/PeerRequests'
import NotificationsPopover from '@/components/notifications/NotificationsPopover'
import { peerService } from '@/app/api/peers/peerService'
import { notificationService } from '@/app/api/notifications/notificationService'
import { toast } from "react-hot-toast"
import { Timestamp } from 'firebase/firestore'

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
  onPeerUpdate?: () => void
}

interface RequestItemProps {
  name: string
  skill: string
  type: string
  status: string
}

function RequestItem({ name, skill, type, status }: RequestItemProps) {
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

export default function UserProfileClient({ userId, initialSkills, initialCalendarData, showSidebarUser = false, onPeerUpdate }: UserProfileClientProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [skills, setSkills] = useState(initialSkills)
  const [calendarData] = useState(initialCalendarData)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSkill, setSelectedSkill] = useState<string>("")
  const [skillLevel, setSkillLevel] = useState<string>("Beginner")
  const [showSidebar, setShowSidebar] = useState(true)
  const [notes, setNotes] = useState([
    { id: 1, content: "Prefers morning sessions for teaching. Available on weekends for learning." },
    { id: 2, content: "Good at explaining complex concepts" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [isAddingPeer, setIsAddingPeer] = useState(false)
  const [peerRequestSent, setPeerRequestSent] = useState(false)
  const [peerRequest, setPeerRequest] = useState<any | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized')
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      setFirebaseUser(user)
      try {
        // Fetch current user's data
        const currentUserData = await userDataService.getUser(user.uid)
        setCurrentUser(currentUserData)

        // Fetch profile user's data
        const profileUserData = await userDataService.getUser(userId)
        if (!profileUserData) {
          console.error('Profile user not found')
          router.push('/peers')
          return
        }
        setUserData(profileUserData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router, userId])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await skillsService.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch skills for selected category
  useEffect(() => {
    const fetchSkillsByCategory = async () => {
      if (selectedCategory) {
        try {
          const skillsData = await skillsService.getSkillsByCategory(selectedCategory)
          setAvailableSkills(skillsData)
        } catch (error) {
          console.error('Error fetching skills by category:', error)
        }
      } else {
        setAvailableSkills([])
      }
    }
    fetchSkillsByCategory()
  }, [selectedCategory])

  // Update the edit buttons visibility based on whether viewing own profile
  const isOwnProfile = currentUser?.uid === userId

  // Check for existing peer request between current user and profile user
  useEffect(() => {
    const checkPeerRequest = async () => {
      if (!currentUser || !userData) return
      try {
        const req = await peerService.findPeerRequestBetweenUsers(currentUser.uid, userId)
        setPeerRequest(req)
      } catch (error) {
        setPeerRequest(null)
      }
    }
    if (!isOwnProfile && currentUser && userId) {
      checkPeerRequest()
    }
  }, [currentUser, userId, isOwnProfile, peerRequestSent])

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

  // Update the onValueChange handlers to include type annotations
  const handleCategoryChange = (value: string, index: number, type: 'canTeach' | 'wantToLearn') => {
    const newSkills = { ...skills }
    newSkills[type][index].category = value
    setSkills(newSkills)
  }

  const handleSkillChange = (value: string, index: number, type: 'canTeach' | 'wantToLearn') => {
    const newSkills = { ...skills }
    newSkills[type][index].name = value
    setSkills(newSkills)
  }

  const handleLevelChange = (value: string, index: number, type: 'canTeach' | 'wantToLearn') => {
    const newSkills = { ...skills }
    newSkills[type][index].level = value
    setSkills(newSkills)
  }

  const handleAddPeer = async () => {
    if (!currentUser || !userData) return;
    try {
      console.log('Debug: Starting peer request process');
      console.log('Debug: Sender:', {
        id: currentUser.uid,
        name: `${currentUser.firstName} ${currentUser.surname}`
      });
      console.log('Debug: Receiver:', {
        id: userId,
        name: `${userData.firstName} ${userData.surname}`
      });

      setIsAddingPeer(true);
      await peerService.sendPeerRequest(currentUser.uid, userId, '');
      setPeerRequestSent(true);
      setIsAddingPeer(false);

      // Send notification to receiver
      await notificationService.createNotification({
        userId: userId,
        type: 'peer_request',
        message: 'sent you a peer request',
        fromUserId: currentUser.uid,
        fromUser: {
          firstName: currentUser.firstName || '',
          surname: currentUser.surname || '',
          profilePicture: currentUser.profilePicture || ''
        },
        read: false
      });

      console.log('Debug: Peer request sent successfully');
      
      toast.success(`${currentUser.firstName} ${currentUser.surname} sent a peer request to ${userData.firstName} ${userData.surname}`);
    } catch (error) {
      console.error('Debug: Error in handleAddPeer:', error);
      setIsAddingPeer(false);
      toast.error(`Failed to send peer request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleAcceptPeerRequest = async () => {
    if (!peerRequest || !currentUser) return
    setIsAccepting(true)
    try {
      await peerService.acceptPeerRequest(peerRequest.id)
      setPeerRequest(null)
      // Send notification to sender
      await notificationService.createNotification({
        userId: peerRequest.senderId,
        type: 'peer_accepted',
        message: 'accepted your peer request',
        fromUserId: currentUser.uid,
        fromUser: {
          firstName: currentUser.firstName,
          surname: currentUser.surname,
          profilePicture: currentUser.profilePicture
        },
        read: false
      });
    } catch (error) {
      console.error('Error accepting peer request:', error)
    }
    setIsAccepting(false)
  }

  const handleRejectPeerRequest = async () => {
    if (!peerRequest || !currentUser) return
    setIsRejecting(true)
    try {
      await peerService.rejectPeerRequest(peerRequest.id)
      setPeerRequest(null)
      // Optionally, send notification for rejection
      await notificationService.createNotification({
        userId: peerRequest.senderId,
        type: 'peer_rejected',
        message: 'rejected your peer request',
        fromUserId: currentUser.uid,
        fromUser: {
          firstName: currentUser.firstName,
          surname: currentUser.surname,
          profilePicture: currentUser.profilePicture
        },
        read: false
      });
    } catch (error) {
      console.error('Error rejecting peer request:', error)
    }
    setIsRejecting(false)
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#5C2594]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/50 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>User Profile</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{getUserDisplayName(userData, null)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Accept/Reject UI if current user is receiver and viewing sender's profile */}
            {!isOwnProfile && peerRequest && peerRequest.status === 'pending' && peerRequest.receiverId === currentUser?.uid && peerRequest.senderId === userId && (
              <>
                <Button 
                  size="sm"
                  className="bg-[#FFD34E] text-[#5C2594] hover:bg-[#FFD34E]/90 font-bold transition-colors duration-300"
                  onClick={handleAcceptPeerRequest}
                  disabled={isAccepting}
                >
                  {isAccepting ? 'Accepting...' : 'Accept Request'}
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={handleRejectPeerRequest}
                  disabled={isRejecting}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            )}
            {/* Add Peer button if no request exists and not own profile */}
            {!isOwnProfile && !peerRequest && !peerRequestSent && (
              <Button 
                size="sm"
                className="bg-[#FFD34E] text-[#5C2594] hover:bg-[#FFD34E]/90 font-bold transition-colors duration-300"
                onClick={handleAddPeer}
                disabled={isAddingPeer}
              >
                {isAddingPeer ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#5C2594] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Add Peer
                  </>
                )}
              </Button>
            )}
            {/* Show Accept/Reject buttons if there's a pending request from the profile user to current user */}
            {!isOwnProfile && peerRequest && peerRequest.status === 'pending' && peerRequest.senderId === userId && peerRequest.receiverId === currentUser?.uid && (
              <>
                <Button
                  size="sm"
                  className="bg-[#FFD34E] text-[#5C2594] hover:bg-[#FFD34E]/90 font-bold transition-colors duration-300"
                  onClick={handleAcceptPeerRequest}
                  disabled={isAccepting}
                >
                  {isAccepting ? 'Accepting...' : 'Accept Request'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={handleRejectPeerRequest}
                  disabled={isRejecting}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            )}
            {/* Request sent badge */}
            {!isOwnProfile && (peerRequestSent || (peerRequest && peerRequest.status === 'pending' && peerRequest.senderId === currentUser?.uid && peerRequest.receiverId === userId)) && (
              <Badge variant="outline" className="bg-[#FFD34E] text-[#5C2594] font-bold">
                Request Sent
              </Badge>
            )}
            {isOwnProfile && (
              <>
                <NotificationsPopover userId={userId} />
                <Button variant="ghost" className="text-[#0D5FF9] hover:bg-blue-50" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </Button>
              </>
            )}
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
                <AvatarImage src={userData?.profilePicture || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-gradient-to-br from-[#FFD34E] to-[#FFB84E] text-[#5C2594] font-bold">
                  {getUserInitials(userData, null)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
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
                            if (firebaseUser) {
                              await userDataService.updateProfilePicture(firebaseUser.uid, imageUrl)
                              setUserData(prev => prev ? { ...prev, profilePicture: imageUrl } : null)
                            }
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
              )}
            </div>
            <div className="flex-1 flex items-center gap-4">
              <span className="ml-4 text-lg font-bold text-yellow-300 drop-shadow">{getUserDisplayName(userData, null)}</span>
              {isOwnProfile && isEditingProfile && (
                <Button variant="ghost" size="sm" className="text-[#FFD34E] hover:bg-[#FFD34E]/20 font-bold transition-colors duration-300" onClick={() => setIsEditingProfile(false)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <p className="text-white/80 mb-4">Skill Exchange Profile</p>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Skills Offered */}
          <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6">
            <h3 className="text-lg font-bold text-[#5C2594] mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#FFD34E]" />
              Skills I Can Teach
            </h3>
            <div className="space-y-2">
              {userData?.skillsOffered && userData.skillsOffered.length > 0 ? (
                userData.skillsOffered.map((skill: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#F3E8FF] text-[#5C2594] px-4 py-2 rounded-lg font-semibold shadow"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No skills to teach yet.</div>
              )}
            </div>
          </div>
          {/* Skills Wanted */}
            <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6">
              <h3 className="text-lg font-bold text-[#5C2594] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FFD34E]" />
                Skills I Want to Learn
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(userData?.skillsWanted) && userData.skillsWanted.length > 0 ? (
                  userData.skillsWanted.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-[#FEF9C3] text-[#92400E] px-4 py-2 rounded-full font-semibold shadow"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No skills wanted yet.</span>
                )}
              </div>
            </div>
          </div>
          {/*<div className="grid grid-cols-2 gap-8 mb-6">
            <div className="relative bg-[#5C2594] rounded-xl p-6 shadow-lg border border-[#FFD34E]/40">
               <div className="absolute -top-4 left-4 bg-[#FFD34E] text-[#5C2594] font-bold rounded-b-lg px-3 py-1 text-xs shadow">01</div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#FFD34E]" />
                  Skills I Can Teach
                </h3>
                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FFD34E] hover:bg-[#FFD34E]/20 font-bold transition-colors duration-300"
                    onClick={() => setIsEditingSkills(!isEditingSkills)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    {isEditingSkills ? "Save" : "Edit"}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {skills.canTeach.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#6A35A6] rounded-lg shadow-sm border border-[#FFD34E]/20 hover:shadow-md transition-shadow">
                    {isEditingSkills ? (
                      <>
                        <div className="flex-1 flex gap-2">
                          <Select
                            value={skill.category}
                            onValueChange={(value: string) => handleCategoryChange(value, index, 'canTeach')}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={skill.name}
                            onValueChange={(value: string) => handleSkillChange(value, index, 'canTeach')}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSkills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.name}>
                                  {skill.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={skill.level}
                            onValueChange={(value: string) => handleLevelChange(value, index, 'canTeach')}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                          <p className="text-sm font-bold text-white">{skill.name}</p>
                          <p className="text-xs text-[#FFD34E]">{skill.category}</p>
                        </div>
                        <Badge variant="outline" className="bg-[#FFD34E] text-[#5C2594] font-bold">{skill.level}</Badge>
                      </>
                    )}
                  </div>
                ))}
                {isEditingSkills && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedSkill}
                        onValueChange={setSelectedSkill}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((skill) => (
                            <SelectItem key={skill.id} value={skill.name}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={skillLevel}
                        onValueChange={setSkillLevel}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={!selectedCategory || !selectedSkill}
                      onClick={() => {
                        if (selectedCategory && selectedSkill) {
                          const newSkills = { ...skills }
                          newSkills.canTeach.push({
                            name: selectedSkill,
                            level: skillLevel,
                            category: selectedCategory
                          })
                          setSkills(newSkills)
                          setSelectedCategory("")
                          setSelectedSkill("")
                          setSkillLevel("Beginner")
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="relative bg-[#5C2594] rounded-xl p-6 shadow-lg border border-[#FFD34E]/40">
              <div className="absolute -top-4 left-4 bg-[#FFD34E] text-[#5C2594] font-bold rounded-b-lg px-3 py-1 text-xs shadow">02</div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FFD34E]" />
                  Skills I Want to Learn
                </h3>
                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FFD34E] hover:bg-[#FFD34E]/20 font-bold transition-colors duration-300"
                    onClick={() => setIsEditingSkills(!isEditingSkills)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    {isEditingSkills ? "Save" : "Edit"}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {skills.wantToLearn.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#6A35A6] rounded-lg shadow-sm border border-[#FFD34E]/20 hover:shadow-md transition-shadow">
                    {isEditingSkills ? (
                      <>
                        <div className="flex-1 flex gap-2">
                          <Select
                            value={skill.category}
                            onValueChange={(value: string) => handleCategoryChange(value, index, 'wantToLearn')}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={skill.name}
                            onValueChange={(value: string) => handleSkillChange(value, index, 'wantToLearn')}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSkills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.name}>
                                  {skill.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={skill.level}
                            onValueChange={(value: string) => handleLevelChange(value, index, 'wantToLearn')}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                          <p className="text-sm font-bold text-white">{skill.name}</p>
                          <p className="text-xs text-[#FFD34E]">{skill.category}</p>
                        </div>
                        <Badge variant="outline" className="bg-[#FFD34E] text-[#5C2594] font-bold">{skill.level}</Badge>
                      </>
                    )}
                  </div>
                ))}
                {isEditingSkills && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedSkill}
                        onValueChange={setSelectedSkill}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((skill) => (
                            <SelectItem key={skill.id} value={skill.name}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={skillLevel}
                        onValueChange={setSkillLevel}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={!selectedCategory || !selectedSkill}
                      onClick={() => {
                        if (selectedCategory && selectedSkill) {
                          const newSkills = { ...skills }
                          newSkills.wantToLearn.push({
                            name: selectedSkill,
                            level: skillLevel,
                            category: selectedCategory
                          })
                          setSkills(newSkills)
                          setSelectedCategory("")
                          setSelectedSkill("")
                          setSkillLevel("Beginner")
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Calendar Section */}
          <div className="bg-[#5C2594] rounded-xl p-6 shadow-lg border border-[#FFD34E]/40 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Calendar</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal border-white text-white hover:bg-[#FFD34E]/20 transition-colors duration-300">
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#FFD34E]" />
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
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40">
              <p className="text-2xl font-extrabold text-[#5C2594]">15</p>
              <p className="text-sm text-[#5C2594] font-bold">Total Exchanges</p>
            </div>
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40">
              <p className="text-2xl font-extrabold text-[#5C2594]">3</p>
              <p className="text-sm text-[#5C2594] font-bold">Active Exchanges</p>
            </div>
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40">
              <p className="text-2xl font-extrabold text-[#5C2594]">1</p>
              <p className="text-sm text-[#5C2594] font-bold">Owed Exchanges</p>
            </div>
          </div>

          {/* Add Peer Requests section */}
          {currentUser && (
            <div className="mt-8">
              <PeerRequests 
                currentUser={currentUser}
              />
            </div>
          )}
        </div>

        {/* Sidebar and toggle button */}
        <div className="relative h-full">
          <div className={`transition-all duration-300 fixed top-0 right-0 h-full z-40 ${showSidebar ? 'w-80' : 'w-0'} overflow-hidden`}>
            <div className={`h-full bg-[#FFD34E] border-l border-[#FFD34E]/40 shadow-[0_0_15px_rgba(0,0,0,0.05)] flex flex-col ${showSidebar ? 'p-6' : 'p-0'}`}
              style={{ width: showSidebar ? '20rem' : '0', minWidth: showSidebar ? '20rem' : '0' }}>
              {showSidebar && (
                <>
                  {/* Notes Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#5C2594]">Exchange Notes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-4 py-2"
                        onClick={() => {
                          setEditingNoteId(null);
                          setNewNote("");
                          setEditingContent("");
                          setShowAddNote(true);
                        }}
                      >
                        Add Note
                      </Button>
                    </div>
                    {/* Add Note Input */}
                    {showAddNote && (
                      <div className="mb-4 flex gap-2">
                        <input
                          className="flex-1 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                          placeholder="Enter your note..."
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                        />
                        <Button
                          className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-4 py-2"
                          onClick={() => {
                            if (newNote.trim()) {
                              setNotes([...notes, { id: Date.now(), content: newNote.trim() }]);
                              setNewNote("");
                              setShowAddNote(false);
                            }
                          }}
                        >Save</Button>
                        <Button
                          className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-4 py-2"
                          onClick={() => setShowAddNote(false)}
                        >Cancel</Button>
                      </div>
                    )}
                    {/* Notes List */}
                    {notes.map(note => (
                      <Card key={note.id} className="mb-4 bg-[#6A35A6] shadow-lg border border-[#FFD34E]/20 hover:shadow-xl transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between gap-2">
                          {editingNoteId === note.id ? (
                            <>
                              <input
                                className="flex-1 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                                value={editingContent}
                                onChange={e => setEditingContent(e.target.value)}
                              />
                              <Button
                                className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-3 py-2"
                                onClick={() => {
                                  setNotes(notes.map(n => n.id === note.id ? { ...n, content: editingContent } : n));
                                  setEditingNoteId(null);
                                  setEditingContent("");
                                }}
                              >Save</Button>
                              <Button
                                className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-3 py-2"
                                onClick={() => setEditingNoteId(null)}
                              >Cancel</Button>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-white/80 flex-1">{note.content}</p>
                              <Button
                                className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-3 py-2"
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditingContent(note.content);
                                }}
                              >Edit</Button>
                              <Button
                                className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-3 py-2"
                                onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                              >Delete</Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Exchange Requests Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#5C2594]">Exchange Requests</h3>
                      <Button variant="ghost" size="sm" className="bg-black transition-colors duration-300 hover:bg-green-600 text-white font-bold rounded-full px-4 py-2">
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
                </>
              )}
            </div>
            {/* Toggle button: always visible, fixed to right edge when sidebar is closed */}
            <Button
              size="icon"
              variant="ghost"
              className={`transition-colors duration-300 z-50 bg-black text-white rounded-full shadow-2xl border-4 border-white
                fixed top-1/2 transform -translate-y-1/2 scale-110 shadow-black/80 ring-2 ring-yellow-400
                ${showSidebar ? 'right-80' : 'right-0'}
                hover:bg-green-600 hover:text-white hover:scale-125 hover:shadow-2xl hover:ring-4 hover:ring-yellow-400`
              }
              style={{ boxShadow: '0 12px 32px 0 #000b, 0 2px 8px 0 #fff4 inset', borderColor: '#FFD34E' }}
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <ChevronRight className="w-7 h-7 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" style={{ filter: 'drop-shadow(0 2px 4px #FFD34E)' }} />
              ) : (
                <ChevronLeft className="w-7 h-7 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" style={{ filter: 'drop-shadow(0 2px 4px #FFD34E)' }} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 