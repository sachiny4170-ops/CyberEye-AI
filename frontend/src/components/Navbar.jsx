function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
            🛡️
          </div>

          <div>
            <h1 className="text-lg font-bold text-cyan-400">
              CyberEye AI
            </h1>

            <p className="text-xs text-gray-500">
              Security Assessment Platform
            </p>
          </div>
        </a>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-7">

          <a
            href="#top"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Home
          </a>

          <a
            href="#scanner"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Scanner
          </a>

          <a
            href="#about"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            About
          </a>

        </div>

        {/* Status */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

          <span className="text-gray-400">
            Scanner Online
          </span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;