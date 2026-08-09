"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function RoiCalculatorPage() {
  const [spend, setSpend] = useState("");
  const [revenue, setRevenue] = useState("");

  const spendNum = Number(spend) || 0;
  const revenueNum = Number(revenue) || 0;
  const roi = spendNum > 0 ? ((revenueNum - spendNum) / spendNum) * 100 : null;
  const roas = spendNum > 0 ? revenueNum / spendNum : null;

  return (
    <div className="section-y">
      <div className="container-xl max-w-xl">
        <h1 className="font-display text-4xl font-bold">Marketing ROI Calculator</h1>
        <p className="mt-4 text-mist-100/70">See the return on your marketing spend in seconds.</p>

        <div className="card-surface mt-8 flex flex-col gap-4 p-6">
          <Input label="Marketing spend" type="number" placeholder="5000" value={spend} onChange={(e) => setSpend(e.target.value)} />
          <Input label="Revenue generated" type="number" placeholder="18000" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>

        {roi !== null && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="card-surface p-6 text-center">
              <div className="font-display text-3xl font-bold gradient-text">{roi.toFixed(0)}%</div>
              <div className="mt-1 text-xs text-mist-100/60">ROI</div>
            </div>
            <div className="card-surface p-6 text-center">
              <div className="font-display text-3xl font-bold gradient-text">{roas?.toFixed(1)}x</div>
              <div className="mt-1 text-xs text-mist-100/60">ROAS</div>
            </div>
          </div>
        )}
        {spendNum > 0 && revenueNum > 0 && (
          <p className="mt-4 text-sm text-mist-100/60">
            Net profit: {formatCurrency(revenueNum - spendNum)}
          </p>
        )}

        <div className="mt-8 rounded-xl border border-white/10 p-6 text-center">
          <p className="text-sm text-mist-100/70">Want a professional marketing strategy?</p>
          <Button href="/contact" className="mt-3">Book a Free Consultation</Button>
        </div>
      </div>
    </div>
  );
}
