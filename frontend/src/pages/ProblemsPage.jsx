import { Link } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, SearchIcon, LayersIcon } from "lucide-react";

function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const allProblems = Object.values(PROBLEMS);

  // Derived Stats
  const easyProblemsCount = allProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = allProblems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = allProblems.filter((p) => p.difficulty === "Hard").length;

  // Filter Logic
  const filteredProblems = allProblems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = activeFilter === "All" || problem.difficulty === activeFilter;
    return matchesSearch && matchesDifficulty;
  });

  const filters = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-900/10 blur-[120px]" />
      </div>

      {/* MAIN CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-20 pb-20">
          
          {/* HEADER */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-4">
              <LayersIcon className="size-3.5" />
              <span>Problem Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Problems</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Sharpen your coding skills with these curated technical interview questions.
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 PanelGroup">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 PanelGroup-focus-within:text-indigo-400 transition-colors size-5" />
              <input
                type="text"
                placeholder="Search problems by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all shadow-sm placeholder:text-slate-600"
              />
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 border ${
                    activeFilter === filter
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      : "bg-white/[0.03] text-slate-400 border-white/5 hover:bg-white/[0.08]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* PROBLEMS LIST */}
          <div className="space-y-4 mb-16">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="block PanelGroup p-1 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="bg-[#050505]/60 backdrop-blur-xl rounded-[23px] p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* LEFT SIDE */}
                    <div className="flex gap-4">
                      <div className="hidden sm:flex size-12 rounded-2xl bg-indigo-500/10 items-center justify-center shrink-0 PanelGroup-hover:scale-110 PanelGroup-hover:bg-indigo-500/20 transition-all duration-300">
                        <Code2Icon className="size-6 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-white PanelGroup-hover:text-indigo-300 transition-colors">
                            {problem.title}
                          </h2>
                          {/* COLORFUL DIFFICULTY BADGES */}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-indigo-500/80 mb-2">
                          {problem.category}
                        </p>
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {problem.description.text}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center justify-end sm:pl-4 shrink-0">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-indigo-400 PanelGroup-hover:bg-indigo-500 PanelGroup-hover:text-white transition-all duration-300 font-medium text-sm">
                        <span>Solve Problem</span>
                        <ChevronRightIcon className="size-4 PanelGroup-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </Link>
              ))
            ) : (
              <div className="py-16 text-center border border-white/5 rounded-3xl bg-white/[0.02]">
                <SearchIcon className="size-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                <p className="text-slate-400">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* STATS FOOTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-sm font-medium mb-1">Total Library</span>
              <span className="text-3xl font-bold text-white">{allProblems.length}</span>
            </div>
            <div className="p-6 rounded-3xl bg-green-500/[0.02] border border-green-500/10 flex flex-col items-center justify-center text-center hover:bg-green-500/[0.05] transition-colors">
              <span className="text-green-500/80 text-sm font-medium mb-1">Easy</span>
              <span className="text-3xl font-bold text-green-400">{easyProblemsCount}</span>
            </div>
            <div className="p-6 rounded-3xl bg-yellow-500/[0.02] border border-yellow-500/10 flex flex-col items-center justify-center text-center hover:bg-yellow-500/[0.05] transition-colors">
              <span className="text-yellow-500/80 text-sm font-medium mb-1">Medium</span>
              <span className="text-3xl font-bold text-yellow-400">{mediumProblemsCount}</span>
            </div>
            <div className="p-6 rounded-3xl bg-red-500/[0.02] border border-red-500/10 flex flex-col items-center justify-center text-center hover:bg-red-500/[0.05] transition-colors">
              <span className="text-red-500/80 text-sm font-medium mb-1">Hard</span>
              <span className="text-3xl font-bold text-red-400">{hardProblemsCount}</span>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default ProblemsPage;