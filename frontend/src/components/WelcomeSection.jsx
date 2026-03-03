import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, ZapIcon, Code2Icon, Terminal } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[#030712] border border-white/5 p-8 md:p-12 mb-10 shadow-2xl">
      
      {/* 🎨 BACKGROUND DECORATION (Modern Glows) */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        
        {/* LEFT: CONTENT AREA */}
        <div className="space-y-6 max-w-2xl">
          {/* Badge Style Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <div className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            System Online
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
                {user?.firstName || "Developer"}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-md leading-relaxed">
              Don't just code. <span className="text-slate-200">Collaborate.</span> Build the future of engineering interviews together.
            </p>
          </div>

          {/* Quick Stats/Features Mini-row */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Terminal className="size-4 text-indigo-500" />
              <span className="text-sm font-mono tracking-tight text-slate-300">Live Compiler</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Code2Icon className="size-4 text-fuchsia-500" />
              <span className="text-sm font-mono tracking-tight text-slate-300">Real-time Pair</span>
            </div>
          </div>
        </div>

        {/* RIGHT: PREMIUM ACTION CARD */}
        <div className="relative group shrink-0">
          {/* Animated Border Gradient behind button */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative flex flex-col items-center gap-6 p-8 rounded-[1.8rem] bg-[#0A0F1C]/90 border border-white/10 backdrop-blur-xl min-w-[280px]">
            
            {/* LOGO CHANGED TO >_ (Terminal Icon) */}
            <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-700 flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 border border-white/10">
              <Terminal className="size-8 text-white" strokeWidth={3} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-white font-bold text-lg tracking-tight">New Interview Session</h3>
              <p className="text-slate-500 text-xs font-medium">Invite your partner and start</p>
            </div>

            <button
              onClick={onCreateSession}
              className="group/btn relative w-full px-8 py-4 bg-white text-black rounded-2xl font-black text-base overflow-hidden transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-white/20"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-tight">
                <ZapIcon className="size-5 fill-black" />
                <span>Create Session</span>
                <ArrowRightIcon className="size-5 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WelcomeSection;