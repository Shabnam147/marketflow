const logos = ["Northline", "Verdant", "Cursive", "Halo & Co", "Pathwise", "Amberly"];

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 bg-navy-900/50 py-10">
      <div className="container-xl">
        <p className="text-center text-xs uppercase tracking-widest text-mist-100/40">
          Trusted by growing teams (sample brands)
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {logos.map((logo) => (
            <span key={logo} className="font-display text-lg font-semibold text-mist-100">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
