const stats = [
  { value: "+185%", label: "Organic Traffic" },
  { value: "+72%", label: "Leads" },
  { value: "3.8x", label: "ROAS" },
  { value: "+64%", label: "Conversion Rate" },
];

export default function Results() {
  return (
    <section className="section-y bg-navy-900/40">
      <div className="container-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Results our campaigns are built for</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-mist-100/50">
            Example / demo figures — not guaranteed results
          </span>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-8 text-center">
              <div className="font-display text-4xl font-bold gradient-text">{s.value}</div>
              <div className="mt-2 text-sm text-mist-100/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
