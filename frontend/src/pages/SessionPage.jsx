import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, UsersIcon } from "lucide-react"; 
import CodeEditorPanel from "../components/CodeEditorPanel"; 
import OutputPanel from "../components/OutputPanel"; 

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import ProblemDescription from "../components/ProblemDescription";


import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const [currentProblemId, setCurrentProblemId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [searchParams] = useSearchParams(); //  URL parameters nikalne ke liye hook
  
  // URL se pwd nikalna (e.g. ?pwd=A1B2C3)
  const pwdFromUrl = searchParams.get("pwd");

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [manualPassword, setManualPassword] = useState("");

  useEffect(() => {
    if (session?.problem) {
      const matchedProblemEntry = Object.entries(PROBLEMS).find(([key, p]) => p.title === session.problem);
      if (matchedProblemEntry) {
        setCurrentProblemId(matchedProblemEntry[0]);
      } else {
        setCurrentProblemId(Object.keys(PROBLEMS)[0]);
      }
    }
  }, [session?.problem]);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return; // Agar already ander hai toh kuch mat karo

    if (pwdFromUrl) {
      // 1. Agar Magic Link se aaya hai, toh seedha join API hit kar do
      joinSessionMutation.mutate(
        { id: id, password: pwdFromUrl },
        { 
          onSuccess: () => {
             toast.success("Joined session via Magic Link!");
             refetch();
          },
          onError: () => {
             toast.error("Invalid or Expired Magic Link!");
             setShowPasswordPrompt(true); // Galat link hone pe prompt dikhao
          }
        }
      );
    } else {
      // 2. Agar bina pwd ke URL khola hai, toh Pop-up dikhao
      setShowPasswordPrompt(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user, loadingSession, isHost, isParticipant, id, pwdFromUrl]);


  // Manual password submit handle karna
  const handleManualJoin = (e) => {
    e.preventDefault();
    if(!manualPassword) return;
    
    joinSessionMutation.mutate(
        { id: id, password: manualPassword },
        { 
          onSuccess: () => {
            setShowPasswordPrompt(false);
            refetch();
            // Note: success toast pehle hi hooks me likha hai, yahan dobara likhne ki zaroorat nahi.
          },
          // Error handling bhi hook me already hai
        }
      );
  };

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (currentProblem?.starterCode?.[selectedLanguage]) {
      setCode(currentProblem.starterCode[selectedLanguage]);
    }
  }, [currentProblem, selectedLanguage]);

  const handleProblemChange = (newProblemId) => {
    setCurrentProblemId(newProblemId);
    const newProblem = PROBLEMS[newProblemId];
    if (newProblem?.starterCode?.[selectedLanguage]) {
      setCode(newProblem.starterCode[selectedLanguage]);
    }
    setOutput(null);
  };

  const handleLanguageChange = (e) => {
    const newLang = e?.target?.value || e;
    setSelectedLanguage(newLang);
    const starterCode = currentProblem?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    let strOutput = Array.isArray(output) ? output.join("\n") : String(output);
    return strOutput
      .replace(/\r/g, "")
      .replace(/\[\s+/g, "[")
      .replace(/\s+\]/g, "]")
      .replace(/\s*,\s*/g, ",")
      .replace(/ +/g, " ")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    let actualStr = typeof actualOutput === "object" && actualOutput !== null
      ? actualOutput.run?.output || actualOutput.output || actualOutput.stdout || JSON.stringify(actualOutput)
      : actualOutput;

    let expectedStr = typeof expectedOutput === "object"
      ? JSON.stringify(expectedOutput)
      : expectedOutput;

    const normalizedActual = normalizeOutput(actualStr);
    const normalizedExpected = normalizeOutput(expectedStr);

    return normalizedActual === normalizedExpected;
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success && currentProblem) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else if (!result.success) {
      toast.error("Code execution failed!");
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-[#030712] text-slate-200 font-sans selection:bg-teal-500/30 flex flex-col overflow-hidden">
      {/* Background and other UI remains same */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="flex-1 relative z-10 overflow-hidden p-2 md:p-3">
        <PanelGroup direction="horizontal" className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#0A0F1C]/80 backdrop-blur-sm">
          
          <Panel defaultSize={25} minSize={20}>
            <div className="h-full relative bg-[#0A0F1C]/50 flex flex-col">
              <div className="p-4 border-b border-white/5 bg-[#0A0F1C]/90 backdrop-blur-md shrink-0 flex items-center justify-between gap-2 z-20">
                <span className="flex items-center gap-1.5 text-slate-400 text-xs bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  <UsersIcon className="size-3 text-teal-500" />
                  Host: <span className="text-slate-200">{session?.host?.firstName || "Dev"}</span>
                </span>
                {isHost && session?.status === "active" && (
                  <button onClick={handleEndSession} disabled={endSessionMutation.isPending} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-1.5 font-bold text-xs">
                    {endSessionMutation.isPending ? <Loader2Icon className="size-3 animate-spin" /> : <LogOutIcon className="size-3" />}
                    End
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {currentProblem ? (
                  <ProblemDescription
                    problem={currentProblem}
                    currentProblemId={currentProblemId}
                    onProblemChange={handleProblemChange}
                    allProblems={Object.values(PROBLEMS).map(p => ({ id: Object.keys(PROBLEMS).find(k => PROBLEMS[k] === p), title: p.title }))}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center p-6 text-slate-500 text-center">Loading Problem...</div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-[#030712] hover:bg-teal-500/20 transition-colors cursor-col-resize flex items-center justify-center border-x border-white/5 z-10">
            <div className="h-12 w-0.5 bg-white/20 rounded-full" />
          </PanelResizeHandle>

          <Panel defaultSize={25} minSize={20}>
            <div className="h-full bg-[#0A0F1C]/70 relative overflow-hidden border-r border-white/5">
              {isInitializingCall ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2Icon className="size-10 text-teal-400 animate-spin mb-4" />
                  <p className="text-sm font-bold text-white">Securing Connection...</p>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <PhoneOffIcon className="size-8 text-red-500 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-white mb-1">Connection Failed</h2>
                  </div>
                </div>
              ) : (
                <div className="h-full relative z-10">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-[#030712] hover:bg-teal-500/20 transition-colors cursor-col-resize flex items-center justify-center border-x border-white/5 z-10">
            <div className="h-12 w-0.5 bg-white/20 rounded-full" />
          </PanelResizeHandle>

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20}>
                <CodeEditorPanel
                  code={code}
                  selectedLanguage={selectedLanguage}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>
              <PanelResizeHandle className="h-2 w-full bg-white/5 hover:bg-primary/50 cursor-row-resize flex items-center justify-center">
                <div className="h-[1px] w-8 bg-white/20 rounded-full" />
              </PanelResizeHandle>
              <Panel defaultSize={30} minSize={10}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>

        </PanelGroup>
      </div>
      {/* PASSWORD PROMPT MODAL (Agar link me pwd nahi hai) */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Private Room 🔒</h3>
            <p className="text-slate-400 text-sm mb-6">This interview session requires a password to enter.</p>
            
            <form onSubmit={handleManualJoin}>
              <input 
                type="text" 
                placeholder="Enter Room Password" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono tracking-widest text-center text-lg mb-4 uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={manualPassword}
                onChange={(e) => setManualPassword(e.target.value.toUpperCase())}
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')} 
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#030712] font-bold transition-colors shadow-lg shadow-teal-500/25 flex items-center justify-center"
                  disabled={joinSessionMutation.isPending || !manualPassword}
                >
                  {joinSessionMutation.isPending ? <Loader2Icon className="animate-spin size-5" /> : "Enter Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPage;