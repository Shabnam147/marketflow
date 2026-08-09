import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="section-y">
      <div className="container-xl">
        <div className="relative overflow-hidden rounded-3xl bg-cta-gradient px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to grow your business?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Book a free strategy call and we&apos;ll show you exactly where the opportunity is.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary" size="lg">
              Book a Free Strategy Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
