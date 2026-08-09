const steps = [
  { label: "Discover", desc: "We audit your business, market and competitors to find real opportunity." },
  { label: "Strategize", desc: "We build a channel plan tied to a specific revenue goal." },
  { label: "Launch", desc: "Campaigns, content and pages go live across the right channels." },
  { label: "Optimize", desc: "We test, refine and cut what isn't converting." },
  { label: "Scale", desc: "We double down on what works and expand into new channels." },
];

export default function Process() {
  return (
    <section className="section-y">
      <div className="container-xl">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Our process</h2>
        <p className="mt-3 max-w-xl text-mist-100/70">A five-stage cycle we run for every client, in order.</p>

        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.label} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-mist-100/20">{String(i + 1).padStart(2, "0")}</span>
                {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-white/10 lg:block" />}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{step.label}</h3>
              <p className="mt-2 text-sm text-mist-100/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
