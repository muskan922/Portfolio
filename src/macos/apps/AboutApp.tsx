import { about, site } from "../../data/content";

export function AboutApp() {
  return (
    <div className="flex h-full flex-col md:flex-row items-center md:items-stretch gap-6 p-6 text-white overflow-y-auto selection:bg-[#2a7de1]/40">
      {/* LEFT COLUMN: Photo and Technical Frame */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-start border border-white/10 bg-white/5 rounded-xl p-4 shrink-0 max-w-[240px] md:max-w-none">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/15 bg-black/40 flex items-center justify-center p-1">
          <img
            src="/muskan.jpeg"
            alt={site.name}
            loading="lazy"
            className="h-full w-full object-contain object-center rounded"
          />
        </div>
        
        {/* Technical Frame Details */}
        <div className="mt-4 w-full font-mono text-[10px] leading-relaxed text-white/50 border-t border-white/10 pt-3 space-y-1">
          <div className="flex justify-between">
            <span>ID:</span>
            <span className="text-emerald-400 font-semibold">PROFILE_01</span>
          </div>
          <div className="flex justify-between">
            <span>NAME:</span>
            <span className="text-white/85">MUSKAN.K</span>
          </div>
          <div className="flex justify-between">
            <span>ROLE:</span>
            <span className="text-white/85">SYSTEM_USER</span>
          </div>
          <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-1.5">
            <span>STATUS:</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Profile Information */}
      <div className="flex-1 flex flex-col justify-start">
        <div className="border-b border-white/10 pb-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase">{site.name}</h2>
          <p className="mt-1.5 text-sm font-semibold tracking-wider text-emerald-400 uppercase font-mono">
            {site.role}
          </p>
        </div>

        <div className="mt-4 flex-1 space-y-4">
          <p className="text-sm leading-relaxed text-white/75 font-sans">
            {about.paragraph}
          </p>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-white/40 mb-2">Core Highlights</h3>
            <ul className="space-y-1.5">
              {about.stats.map((stat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-white/80 font-mono">
                  <span className="text-emerald-400">⚡</span>
                  {stat}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-white/10 pt-4 flex gap-6 text-xs text-white/50 font-mono">
            <div>
              <p className="text-[10px] text-white/30">LOCATION</p>
              <p className="text-white/70 mt-0.5">{site.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30">CONTACT</p>
              <p className="text-white/70 mt-0.5">{site.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
