import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden py-8 md:py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* LEFT: Greeting Content */}
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <SparklesIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">{user?.firstName || "there"}</span>!
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 md:ml-16">
            Ready to level up your coding skills?
          </p>
        </div>

        {/* RIGHT: Action Button */}
        <button
          onClick={onCreateSession}
          className="group w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-full text-white font-semibold text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_45px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shrink-0"
        >
          <ZapIcon className="w-5 h-5" />
          <span>Create Session</span>
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
      </div>
    </div>
  );
}

export default WelcomeSection;