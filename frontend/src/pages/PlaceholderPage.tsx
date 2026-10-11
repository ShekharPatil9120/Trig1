import { Construction } from "lucide-react";
import { ButtonLink } from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <PageHeader title={title} description={description} eyebrow="Coming soon" />
        <div className="mt-8 flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white text-blue-700 shadow-sm">
            <Construction className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-950">This module is not implemented yet</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Task 1 only builds the dashboard foundation. This page is intentionally a placeholder so unfinished workflows are not
            presented as operational.
          </p>
          <div className="mt-6">
            <ButtonLink to="/dashboard" variant="secondary">
              Back to Dashboard
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
