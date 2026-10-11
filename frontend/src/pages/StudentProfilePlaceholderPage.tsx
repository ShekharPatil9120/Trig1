import { ArrowLeft, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

export default function StudentProfilePlaceholderPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <Link to="/students" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Student Register
        </Link>
        <div className="mt-6 flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <PageHeader
            title="Student Profile Coming Next"
            description={`Task 4 will implement the full student profile for record ${id ?? ""}. The register action is wired so it does not lead to a blank page.`}
          />
        </div>
      </section>
    </div>
  );
}
