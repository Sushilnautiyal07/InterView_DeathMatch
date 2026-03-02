import { Link } from "react-router";
import Footer from "../components/Footer";
import {
  ArrowRightIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  TerminalIcon,
  LayoutDashboardIcon,
  CpuIcon,
  PlayIcon,
  CheckCircle2Icon,
  GlobeIcon,
  MoveDownIcon,
  GithubIcon,
  LinkedinIcon
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

// --- TEAM DATA ---
const teamMakers = [
  {
    name: "Ayush Raj",
    role: "Backend Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush&backgroundColor=6366f1", 
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Sushil Nautiyal",
    role: "Backend Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sushil&backgroundColor=d946ef",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Shainkey Pundir",
    role: "Backend Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shainkey&backgroundColor=06b6d4",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Swasti Mittal",
    role: "ML Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Swasti&backgroundColor=8b5cf6",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  }
];

// Duplicate the array 4 times to ensure it covers ultra-wide screens for a seamless loop
const infiniteMakers = [...teamMakers, ...teamMakers, ...teamMakers, ...teamMakers];

function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* INJECTING CUSTOM KEYFRAMES FOR MARQUEE */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-900/10 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 PanelGroup">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[1px] PanelGroup-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
              <div className="w-full h-full bg-[#050505] rounded-xl flex items-center justify-center">
                <SparklesIcon className="size-5 text-indigo-400 PanelGroup-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white">
                ProctoHire
              </span>
            </div>
          </Link>

          {/* NAV ACTIONS */}
          <div className="flex items-center gap-4">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="hidden md:block px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="PanelGroup relative px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 PanelGroup-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-1 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            ProctoHire Beta is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
            Technical Interviews, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
              Reinvented.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            The most powerful platform for real-time video interviews and collaborative coding. Run execution environments, track logic, and hire the top 1% seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {/* UPDATED: REDIRECTS TO DASHBOARD WITH ?create=true */}
            <SignInButton mode="modal" forceRedirectUrl="/dashboard?create=true">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-full text-white font-semibold text-base shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                <VideoIcon className="size-5" />
                Start Interview Room
              </button>
            </SignInButton>
            
            {/* UPDATED: REDIRECTS DIRECTLY TO PROBLEMS PAGE */}
            <SignInButton mode="modal" forceRedirectUrl="/problems">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-slate-200 font-semibold text-base hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <TerminalIcon className="size-5" />
                Practice Problems
              </button>
            </SignInButton>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A complete technical suite</h2>
            <p className="text-slate-400 text-center max-w-2xl">Everything you need to conduct world-class engineering interviews and collaborate on complex algorithms in real-time.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="PanelGroup p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 PanelGroup-hover:scale-110 transition-transform">
                <VideoIcon className="size-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Ultra-Low Latency Video</h3>
              <p className="text-slate-400 leading-relaxed">WebRTC-powered crystal clear video calling designed specifically to not drop frames while compiling heavy code.</p>
            </div>

            <div className="PanelGroup p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 PanelGroup-hover:scale-110 transition-transform">
                <Code2Icon className="size-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Language IDE</h3>
              <p className="text-slate-400 leading-relaxed">A full-fledged collaborative code editor with syntax highlighting, auto-complete, and support for 40+ languages.</p>
            </div>

            <div className="PanelGroup p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 PanelGroup-hover:scale-110 transition-transform">
                <CpuIcon className="size-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Execution Engine</h3>
              <p className="text-slate-400 leading-relaxed">Don't just write code, run it. Instant secure sandboxed execution to verify edge cases and algorithmic efficiency.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (STEPPER) */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">From setup to success in seconds</h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {[
              { step: "01", title: "Create Room", desc: "Generate a secure interview link instantly.", icon: <LayoutDashboardIcon className="size-5" /> },
              { step: "02", title: "Join Face-to-Face", desc: "Connect via high-fidelity video and audio.", icon: <UsersIcon className="size-5" /> },
              { step: "03", title: "Solve Together", desc: "Write, run, and debug code collaboratively.", icon: <PlayIcon className="size-5" /> },
              { step: "04", title: "Review & Hire", desc: "Playback code history and make decisions.", icon: <CheckCircle2Icon className="size-5" /> },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="size-12 rounded-full bg-[#050505] border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 z-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  {item.icon}
                </div>
                <div className="text-sm font-mono text-indigo-500 mb-2">Step {item.step}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DEVELOPER / STUDENT AUDIENCE SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for whoever is at the keyboard.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">Whether you are a hyper-growth startup hiring top talent, or a PanelGroup of friends grinding LeetCode, our infrastructure scales to your needs.</p>
              <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors w-fit">
                Explore Use Cases <ArrowRightIcon className="size-4" />
              </button>
            </div>
            
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 relative overflow-hidden PanelGroup">
                <div className="absolute top-0 right-0 p-6 opacity-20 PanelGroup-hover:opacity-100 PanelGroup-hover:scale-110 transition-all duration-500">
                  <GlobeIcon className="size-24 text-indigo-500" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold text-white mb-2">For Students</h4>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-indigo-400" /> Mock interviews with peers</li>
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-indigo-400" /> Real-time DSA practice</li>
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-indigo-400" /> Placement preparation</li>
                  </ul>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 relative overflow-hidden PanelGroup">
                <div className="absolute top-0 right-0 p-6 opacity-20 PanelGroup-hover:opacity-100 PanelGroup-hover:scale-110 transition-all duration-500">
                  <TerminalIcon className="size-24 text-fuchsia-500" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold text-white mb-2">For Recruiters</h4>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-fuchsia-400" /> Standardized environments</li>
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-fuchsia-400" /> Code playback & history</li>
                    <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2Icon className="size-4 text-fuchsia-400" /> Zero setup required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANIMATED: MEET THE MAKERS SECTION */}
        <section className="pt-24 pb-12 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight flex justify-center items-center gap-3">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Makers</span>
              <SparklesIcon className="size-6 text-fuchsia-500 opacity-80" />
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The engineering team behind ProctoHire's infrastructure and intelligence.
            </p>
          </div>

          <div className="relative w-full overflow-hidden flex">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-ltr gap-6 py-8 px-3">
              {infiniteMakers.map((member, idx) => (
                <div 
                  key={idx} 
                  className="PanelGroup relative p-1 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-indigo-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out hover:shadow-[0_10px_40px_rgba(99,102,241,0.2)] hover:z-20 w-[280px] shrink-0 cursor-default"
                >
                  <div className="bg-[#050505]/80 backdrop-blur-xl rounded-[23px] p-8 text-center h-full flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full blur-md opacity-0 PanelGroup-hover:opacity-60 transition-opacity duration-500" />
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full relative z-10 object-cover border-2 border-white/10 PanelGroup-hover:border-transparent transition-colors duration-300 bg-[#0a0a0a]"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 PanelGroup-hover:text-indigo-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className={`text-sm font-mono mb-6 ${member.role === 'ML Engineer' ? 'text-fuchsia-400/80' : 'text-indigo-400/80'}`}>
                      {member.role}
                    </p>
                    <div className="flex items-center gap-4 opacity-50 PanelGroup-hover:opacity-100 PanelGroup-hover:-translate-y-1 transition-all duration-300 mt-auto">
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-indigo-500 hover:text-white text-slate-300 transition-colors cursor-pointer">
                        <GithubIcon className="size-5" />
                      </a>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white text-slate-300 transition-colors cursor-pointer">
                        <LinkedinIcon className="size-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;