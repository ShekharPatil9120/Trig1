import logoUrl from "../../../../Swami Vivekananda Orange Portrait Emblem.png";

export const schoolName = "Vivekananda School";

type SchoolLogoProps = { className?: string };

export default function SchoolLogo({ className = "h-10 w-10" }: SchoolLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Swami Vivekananda emblem"
      className={`shrink-0 rounded-full bg-white object-contain ${className}`}
    />
  );
}
