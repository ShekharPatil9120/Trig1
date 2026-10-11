import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
};

type ButtonLinkProps = {
  children: ReactNode;
  icon?: LucideIcon;
  to: string;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-blue-700 bg-blue-700 text-white shadow-sm hover:bg-blue-800",
  secondary: "border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700",
};

function content(children: ReactNode, Icon?: LucideIcon) {
  return (
    <>
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{children}</span>
    </>
  );
}

export function Button({ children, icon, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {content(children, icon)}
    </button>
  );
}

export function ButtonLink({ children, icon, to, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${variantClasses[variant]}`}
    >
      {content(children, icon)}
    </Link>
  );
}
