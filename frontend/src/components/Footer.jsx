import { Link } from "react-router";
import { TerminalIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Grid layout for links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-4 w-fit">
              <div className="size-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[1px] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300">
                <div className="w-full h-full bg-[#050505] rounded-lg flex items-center justify-center">
                  <TerminalIcon className="size-4 text-indigo-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                ProctoHire
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The ultimate platform for real-time video interviews and collaborative coding. Built for the top 1%.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <TwitterIcon className="size-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <GithubIcon className="size-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0A66C2] transition-colors">
                <LinkedinIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/problems" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Problem Library</Link></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Interview Prep Guide</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Acceptable Use</a></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} ProctoHire Alpha. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <span className="text-fuchsia-500 animate-pulse">❤️</span>
            <span>by the Makers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;