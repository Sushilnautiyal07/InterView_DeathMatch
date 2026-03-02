import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useCreateSession, useActiveSessions, useMyRecentSessions } from "../hooks/useSessions";
import { ClockIcon, SparklesIcon } from "lucide-react"; 

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  // REAL API CALLS RESTORED
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
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  // Variables populated from real data
  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
        
        {/* AMBIENT BACKGROUND GLOWS (Matching Home Page) */}
        <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-900/10 blur-[120px]" />
        </div>

        {/* MAIN CONTENT LAYER */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-20">
            {/* Welcome Section */}
            <div className="mb-1">
              <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
            </div>

            {/* Dashboard Grid layout */}
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
                />
              </div>
            </div>

            {/* Premium "Session History" Section */}
            <div className="mt-1 pt-10 border-t border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-4">
                    <ClockIcon className="size-3.5" />
                    <span>Activity Log</span>
                  </div>
                  {/* TEXT STYLING UPDATED HERE TO MATCH PROBLEMS PAGE */}
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
                    Sessions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">History</span>
                    <SparklesIcon className="size-6 text-fuchsia-500 opacity-80" />
                  </h2>
                </div>
              </div>
              
              {/* Glass panel container for RecentSessions */}
              <div className="p-1 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5">
                <div className="bg-[#050505]/50 backdrop-blur-xl rounded-[23px] p-6">
                  <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
                </div>
              </div>
            </div>
          </main>
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
    </>
  );
}

export default DashboardPage;