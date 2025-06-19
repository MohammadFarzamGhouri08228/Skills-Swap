"use client"
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import PeerRequests from '@/components/peers/PeerRequests'
import NotificationsPopover from '@/components/notifications/NotificationsPopover'
import { peerService } from '@/app/api/peers/peerService'
import { notificationService } from '@/app/api/notifications/notificationService'
import { toast } from "react-hot-toast"

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
function formatJoinedDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  // Example: May 27, 2025
  return format(date, "MMMM d, yyyy");
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
  const [totalPeers, setTotalPeers] = useState<number>(0);

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

  // Fetch total peers from userPeers collection
  useEffect(() => {
    if (!userId) return;
    const fetchPeers = async () => {
      try {
        if (!db) {
          console.error("Firestore is not initialized");
          setTotalPeers(0);
          return;
        }
        const userPeersRef = doc(db, "userPeers", userId);
        const userPeersSnap = await getDoc(userPeersRef);
        if (userPeersSnap.exists()) {
          const data = userPeersSnap.data();
          setTotalPeers(Array.isArray(data.peers) ? data.peers.length : 0);
        } else {
          setTotalPeers(0);
        }
      } catch (error) {
        console.error("Error fetching user peers:", error);
        setTotalPeers(0);
      }
    };
    fetchPeers();
  }, [userId]);

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

  async function handleAcceptPeerRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!peerRequest || !currentUser) return;
    setIsAccepting(true);
    try {
      await peerService.acceptPeerRequest(peerRequest.id);
      setPeerRequestSent(false);
      setPeerRequest({ ...peerRequest, status: 'accepted' });
      toast.success("Peer request accepted!");
      if (onPeerUpdate) onPeerUpdate();
    } catch (error) {
      toast.error("Failed to accept peer request.");
      console.error("Accept peer request error:", error);
    } finally {
      setIsAccepting(false);
    }
  }

  async function handleRejectPeerRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!peerRequest || !currentUser) return;
    setIsRejecting(true);
    try {
      await peerService.rejectPeerRequest(peerRequest.id);
      setPeerRequestSent(false);
      setPeerRequest({ ...peerRequest, status: 'rejected' });
      toast.success("Peer request rejected!");
      if (onPeerUpdate) onPeerUpdate();
    } catch (error) {
      toast.error("Failed to reject peer request.");
      console.error("Reject peer request error:", error);
    } finally {
      setIsRejecting(false);
    }
  }

  async function handleAddPeer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!currentUser || !userData) return;
    setIsAddingPeer(true);
    try {
      await peerService.sendPeerRequest(currentUser.uid, userId);
      setPeerRequestSent(true);
      toast.success("Peer request sent!");
      if (onPeerUpdate) onPeerUpdate();
    } catch (error) {
      toast.error("Failed to send peer request.");
      console.error("Send peer request error:", error);
    } finally {
      setIsAddingPeer(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#5C2594] flex flex-col">
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

      <div className="flex-1 flex flex-row">
        {/* User Details */}
        <div className="flex-1 p-6">
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

          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-400 to-purple-800 drop-shadow mb-6 tracking-wide">
            Skill Exchange Profile
          </p>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Skills Offered */}
            <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6">
              <h3 className="text-lg font-bold text-[#5C2594] mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#FFD34E]" />
                Skills I Can Teach
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(userData?.skillsOffered) && userData.skillsOffered.length > 0 ? (
                  userData.skillsOffered.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-[#F3E8FF] text-[#5C2594] px-4 py-2 rounded-full font-semibold shadow"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No skills to teach yet.</span>
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
          {/* Exchanges */}
          <div className="flex items-center gap-8">
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40">
              <p className="text-sm text-[#5C2594] font-bold">Total Peers</p>
              <p className="text-2xl font-extrabold text-[#5C2594]">{totalPeers}</p>
            </div>
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40">
              <p className="text-sm text-[#5C2594] font-bold">Date Joined</p>
              <p className="text-2xl font-extrabold text-[#5C2594]">
                {formatJoinedDate(userData?.createdAt)}
              </p>
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
            <div
              className={`h-full bg-[#FFD34E] border-l border-[#FFD34E]/40 shadow-[0_0_15px_rgba(0,0,0,0.05)] flex flex-col ${showSidebar ? 'p-6' : 'p-0'}`}
              style={{ width: showSidebar ? '20rem' : '0', minWidth: showSidebar ? '20rem' : '0' }}
            >
              {showSidebar && (
                <>
                  {/* Exchange Notes Sidebar - fills the sidebar */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#5C2594] text-lg">Exchange Notes</h3>
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
                    {/* Notes List - scrollable and fills sidebar */}
                    <div className="flex-1 overflow-y-auto pr-1">
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