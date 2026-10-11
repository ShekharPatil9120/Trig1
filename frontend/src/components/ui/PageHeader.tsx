type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export default function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      {eyebrow ? <p className="text-sm font-medium text-blue-700">{eyebrow}</p> : null}
      <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
