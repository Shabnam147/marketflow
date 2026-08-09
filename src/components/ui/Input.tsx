import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-mist-100">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-mist-50 placeholder:text-mist-100/30",
            "focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400",
            error && "border-red-500/60 focus:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
