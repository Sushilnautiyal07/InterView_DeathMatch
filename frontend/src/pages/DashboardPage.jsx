import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { 
  useCreateSession, 
  useActiveSessions, 
  useMyRecentSessions
} from "../hooks/useSessions";

import { ClockIcon, SparklesIcon,Loader2Icon } from "lucide-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [createdRoomDetails, setCreatedRoomDetails] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState(null);
  const [manualPassword, setManualPassword] = useState("");

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

 const handleCreateRoom = () => {
  if (!roomConfig.problem || !roomConfig.difficulty) return;

  createSessionMutation.mutate(
    {
      problem: roomConfig.problem,
      difficulty: roomConfig.difficulty.toLowerCase(),
    },
    {
      onSuccess: (data) => {
        setShowCreateModal(false);
     
        const newSession = data.session;
        
      
        toast.success(`Session Created Successfully!`);
        
       
        setCreatedRoomDetails({
          id: newSession._id,
          password: newSession.password
        });
      },
      onError: (error) => {
        console.error("Failed to create room:", error);
        toast.error("Something went wrong while creating the room.");
      }
    }
  );
};

  const copyRoomDetails = () => {
    const magicLink = `${window.location.origin}/session/${createdRoomDetails.id}?pwd=${createdRoomDetails.password}`;
    const textToCopy = `Join my Interview Room!\nMagic Link: ${magicLink}\n\nOr join manually with Password: ${createdRoomDetails.password}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Magic Link Copied to Clipboard!");
  };

  // Active Sessions list se join button click handle karna
  const handleJoinClick = (sessionId) => {
      // Pura join api toh us page pe hai, yahan se bas id leke page pe redirect karo
      // Wahan session page khud password mangega
      navigate(`/session/${sessionId}`);
  }
  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-20">
            <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-1">
                <StatsCards 
                  activeSessionsCount={activeSessions.length} 
                  recentSessionsCount={recentSessions.length} 
                />
              </div>
              <div className="lg:col-span-2">
                <ActiveSessions 
                 
                  sessions={activeSessions} 
                  isLoading={loadingActiveSessions} 
                  isUserInSession={isUserInSession} 
                  onJoinClick={handleJoinClick}
                />
              </div>
            </div>

            <div className="mt-1 pt-10 border-t border-white/5">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  Sessions History
                  <SparklesIcon className="size-6 text-fuchsia-500 opacity-80" />
                </h2>
              </div>
              
              <div className="bg-[#050505]/50 backdrop-blur-xl rounded-[23px] p-6">
                <RecentSessions 
                  sessions={recentSessions} 
                  isLoading={loadingRecentSessions} 
                />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
        
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
      {/* 🔥 Success Modal jo ID aur Password dikhayega Host ko */}
      {createdRoomDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-2">Room Created! 🎉</h3>
              <p className="text-slate-400 text-sm mb-6">Share these details with your candidate so they can join.</p>
              
              <div className="space-y-4 mb-6">
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                     <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Magic Link (Auto-Join)</p>
                     <p className="text-teal-400 font-mono text-sm break-all">{`${window.location.origin}/session/${createdRoomDetails.id}?pwd=${createdRoomDetails.password}`}</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                     <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Room Password (Manual)</p>
                     <p className="text-white font-mono text-xl tracking-[0.2em]">{createdRoomDetails.password}</p>
                  </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={copyRoomDetails} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
                    Copy Details
                 </button>
                 <button onClick={() => navigate(`/session/${createdRoomDetails.id}?pwd=${createdRoomDetails.password}`)} className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#030712] font-bold transition-colors shadow-lg shadow-teal-500/25">
                    Enter Room
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;