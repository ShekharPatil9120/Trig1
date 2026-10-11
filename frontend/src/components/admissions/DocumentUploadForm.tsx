import type { AdmissionFormState, FormErrors } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  errors: FormErrors;
  onChange: (documentId: string, file: File | null) => void;
};

function fileSizeLabel(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploadForm({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Section 5</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Document Uploads</h3>
        </div>
      </div>

      <div className="space-y-4">
        {values.documents.map((documentItem) => (
          <div key={documentItem.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{documentItem.label}</p>
                <p className="text-xs text-slate-500">{documentItem.required ? "Required" : "Optional"}</p>
              </div>

              <div className="flex gap-2">
                {documentItem.file ? (
                  <button
                    type="button"
                    onClick={() => onChange(documentItem.id, null)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-200 hover:text-red-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <input
              aria-label={`${documentItem.label} file`}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx"
              onChange={(event) => onChange(documentItem.id, event.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />

            {documentItem.file ? (
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <p className="break-words font-semibold text-slate-900">{documentItem.file.name}</p>
                <p className="mt-1">
                  {documentItem.file.type || "Unknown file type"} - {fileSizeLabel(documentItem.file.size)}
                </p>
                <p className="mt-1 text-slate-500">Use the file input above to replace this document.</p>
              </div>
            ) : null}
            {documentItem.error ? <p className="mt-2 text-xs text-red-600">{documentItem.error}</p> : null}
            {errors[`document-${documentItem.id}`] ? (
              <p className="mt-2 text-xs text-red-600">{errors[`document-${documentItem.id}`]}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
