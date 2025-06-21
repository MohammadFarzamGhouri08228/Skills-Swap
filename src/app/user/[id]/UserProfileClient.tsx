"use client"
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Upload, GraduationCap, BookOpen, ChevronLeft, Users } from "lucide-react"
import { format } from "date-fns"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { userDataService } from "@/app/api/profile/userDataService"
import { UserData } from "@/app/api/profile/userDataService"
import { useRouter } from "next/navigation"
import { peerService } from '@/app/api/peers/peerService'
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

function formatJoinedDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
}

export default function UserProfileClient({ userId, initialSkills, initialCalendarData, showSidebarUser = false, onPeerUpdate }: UserProfileClientProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(true)
  const [notes, setNotes] = useState([
    { id: 1, content: "Prefers morning sessions for teaching. Available on weekends for learning." },
    { id: 2, content: "Good at explaining complex concepts" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [totalPeers, setTotalPeers] = useState<number>(0);
  const [peerInfos, setPeerInfos] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!auth) {
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
        const currentUserData = await userDataService.getUser(user.uid)
        setCurrentUser(currentUserData)
        const profileUserData = await userDataService.getUser(userId)
        if (!profileUserData) {
          router.push('/peers')
          return
        }
        setUserData(profileUserData)
      } catch (error) {
        //
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [router, userId])

  // Fetch total peers from userPeers collection
  useEffect(() => {
    if (!userId) return;
    const fetchPeers = async () => {
      try {
        if (!db) {
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
      } catch {
        setTotalPeers(0);
      }
    };
    fetchPeers();
  }, [userId]);

  // Fetch peer infos (id + name)
  useEffect(() => {
    const fetchPeerInfos = async () => {
      if (!userId || !db) return;
      try {
        const userPeersRef = doc(db, "userPeers", userId);
        const userPeersSnap = await getDoc(userPeersRef);
        if (userPeersSnap.exists()) {
          const data = userPeersSnap.data();
          if (Array.isArray(data.peers) && data.peers.length > 0) {
            const peerDocs = await Promise.all(
              data.peers.map((peerId: string) =>
                getDoc(doc(db!, "users", peerId)).then(snap => ({ id: peerId, data: snap.data() }))
              )
            );
            const infos = peerDocs
              .map(({ id, data }) => {
                if (!data) return null;
                if (data.firstName && data.surname) return { id, name: `${data.firstName} ${data.surname}` };
                if (data.displayName) return { id, name: data.displayName };
                return { id, name: data.email || "Unknown" };
              })
              .filter(Boolean) as { id: string; name: string }[];
            setPeerInfos(infos);
          } else {
            setPeerInfos([]);
          }
        } else {
          setPeerInfos([]);
        }
      } catch {
        setPeerInfos([]);
      }
    };
    fetchPeerInfos();
  }, [userId, totalPeers]);

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

  const isOwnProfile = currentUser?.uid === userId

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
        </div>
      </header>

      <div className="flex-1 flex flex-row justify-center items-start">
        {/* User Details */}
        <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center">
          {/* User Header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                <AvatarImage src={userData?.profilePicture || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-gradient-to-br from-[#FFD34E] to-[#FFB84E] text-[#5C2594] font-bold text-2xl">
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
                  <Upload className="w-5 h-5" />
                </Button>
              )}
            </div>
            <span className="text-4xl font-extrabold text-yellow-300 drop-shadow text-center">
              {getUserDisplayName(userData, null)}
            </span>
          </div>

          <p className="text-2xl font-bold text-yellow-300 drop-shadow">
            SkillSwap Profile
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Skills Offered */}
            <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold text-[#5C2594] mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#FFD34E]" />
                Skills I Can Teach
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
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
            <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold text-[#5C2594] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FFD34E]" />
                Skills I Want to Learn
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
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
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40 min-w-[140px]">
              <p className="text-sm text-[#5C2594] font-bold">Total Peers</p>
              <p className="text-2xl font-extrabold text-[#5C2594]">{totalPeers}</p>
            </div>
            <div className="text-center bg-[#FFD34E] rounded-xl p-4 shadow-lg border border-[#FFD34E]/40 min-w-[140px]">
              <p className="text-sm text-[#5C2594] font-bold">Date Joined</p>
              <p className="text-2xl font-extrabold text-[#5C2594]">
                {formatJoinedDate(userData?.createdAt)}
              </p>
            </div>
          </div>

          {/* My Peers Section */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-[#FFD34E]/40 p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-[#FFD34E] drop-shadow" />
                <h3 className="text-xl font-extrabold text-[#5C2594] tracking-wide">My Peers</h3>
              </div>
              {peerInfos.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  {peerInfos.map((peer) => (
                    <button
                      key={peer.id}
                      className="bg-[#F3E8FF]/80 text-[#5C2594] px-5 py-2 rounded-full font-semibold shadow transition-all duration-200 hover:bg-[#FFD34E] hover:text-[#5C2594] hover:scale-105 cursor-pointer border border-[#FFD34E]/30 focus:outline-none"
                      onClick={() => router.push(`/user/${peer.id}`)}
                      type="button"
                      title={`View ${peer.name}'s profile`}
                    >
                      {peer.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic text-center">No peers yet.</div>
              )}
            </div>
          </div>
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