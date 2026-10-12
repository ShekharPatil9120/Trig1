import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, RotateCcw, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  bulkAdmissionTemplateUrl,
  importBulkAdmissions,
  type BulkAdmissionImportResponse,
  type BulkAdmissionValidationResponse,
  validateBulkAdmissions,
} from "../../services/admissionsApi";
import { Button } from "../ui/Button";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function fileSizeLabel(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isSupportedBulkFile(file: File) {
  return /\.(xlsx|csv)$/i.test(file.name);
}

function statusClass(status: string) {
  if (status === "valid") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "duplicate") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  return "border-red-200 bg-red-50 text-red-700";
}

function downloadErrorReport(validation: BulkAdmissionValidationResponse) {
  const rows = [["Row Number", "Column", "Value", "Error", "Suggestion"]];
  validation.rows.forEach((row) => {
    row.errors.forEach((error) => {
      rows.push([
        String(error.row_number),
        error.column,
        error.value ?? "",
        error.message,
        error.suggestion ?? "",
      ]);
    });
  });
  validation.errors.forEach((error) => {
    rows.push([String(error.row_number), error.column, error.value ?? "", error.message, error.suggestion ?? ""]);
  });

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bulk-admission-errors.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function BulkAdmissionUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<BulkAdmissionValidationResponse | null>(null);
  const [importResult, setImportResult] = useState<BulkAdmissionImportResponse | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canImport = Boolean(file && validation && validation.valid_rows > 0 && confirmed && !isImporting);
  const invalidCount = (validation?.invalid_rows ?? 0) + (validation?.duplicate_rows ?? 0);
  const previewRows = useMemo(() => validation?.rows.slice(0, 50) ?? [], [validation]);

  const selectFile = (nextFile: File | null) => {
    setNotice(null);
    setValidation(null);
    setImportResult(null);
    setConfirmed(false);

    if (!nextFile) {
      setFile(null);
      return;
    }

    if (!isSupportedBulkFile(nextFile)) {
      setFile(null);
      setNotice("Only .xlsx and .csv files are supported.");
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setNotice("Bulk admission files must be 2 MB or smaller.");
      return;
    }

    setFile(nextFile);
  };

  const handleValidate = async () => {
    if (!file) {
      setNotice("Select an Excel or CSV file before validating.");
      return;
    }

    setIsValidating(true);
    setNotice(null);
    setImportResult(null);
    setConfirmed(false);
    try {
      const result = await validateBulkAdmissions(file);
      setValidation(result);
      setNotice(result.valid_rows > 0 ? "Validation complete. Review the preview before importing." : "Validation complete. No valid rows are ready to import.");
    } catch (error) {
      setValidation(null);
      setNotice(error instanceof Error ? error.message : "Bulk admission file could not be validated.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file || !canImport) {
      return;
    }

    setIsImporting(true);
    setNotice(null);
    try {
      const result = await importBulkAdmissions(file);
      setImportResult(result);
      setValidation(result.validation);
      setNotice(`${result.summary.imported} student records imported successfully.`);
      setConfirmed(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Bulk admission import could not be completed.");
    } finally {
      setIsImporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setValidation(null);
    setImportResult(null);
    setNotice(null);
    setConfirmed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Bulk admission</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Bulk Admission (Excel/CSV Upload)</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Validate a spreadsheet first, review row-level results, then import only the valid student records.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={bulkAdmissionTemplateUrl("xlsx")}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Excel Template</span>
            </a>
            <a
              href={bulkAdmissionTemplateUrl("csv")}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>CSV Template</span>
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectFile(event.dataTransfer.files[0] ?? null);
            }}
            className={`rounded-md border border-dashed p-6 text-center transition ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
            }`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
              <UploadCloud className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Drop an Excel or CSV file here</p>
            <p className="mt-1 text-xs text-slate-500">Supported formats: .xlsx and .csv. Maximum size: 2 MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
              className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              aria-label="Bulk admission file"
            />
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 h-5 w-5 text-blue-700" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Selected file</p>
                {file ? (
                  <div className="mt-2 text-sm text-slate-600">
                    <p className="break-words font-semibold text-slate-900">{file.name}</p>
                    <p className="mt-1">{file.type || "Spreadsheet"} - {fileSizeLabel(file.size)}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No file selected.</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button icon={UploadCloud} onClick={handleValidate} disabled={!file || isValidating}>
                {isValidating ? "Validating..." : "Upload and Validate"}
              </Button>
              <Button variant="secondary" icon={RotateCcw} onClick={reset}>
                Reset Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {notice ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{notice}</p>
          </div>
        </div>
      ) : null}

      {validation ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Validation results</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Preview Student Records</h3>
              <p className="mt-2 text-sm text-slate-500">
                {validation.total_rows} rows checked. {validation.valid_rows} valid, {validation.invalid_rows} invalid, {validation.duplicate_rows} duplicate.
              </p>
            </div>
            <Button variant="secondary" onClick={() => downloadErrorReport(validation)} disabled={invalidCount === 0}>
              Download Error Report
            </Button>
          </div>

          {validation.errors.length > 0 ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {validation.errors.map((error) => (
                <p key={`${error.row_number}-${error.column}-${error.message}`}>{error.message}</p>
              ))}
            </div>
          ) : null}

          {validation.academic_years_to_create.length || validation.classes_to_create.length || validation.sections_to_create.length ? (
            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold">These values will be created during import if confirmed:</p>
              <p className="mt-1">Academic years: {validation.academic_years_to_create.join(", ") || "None"}</p>
              <p>Classes: {validation.classes_to_create.join(", ") || "None"}</p>
              <p>Sections: {validation.sections_to_create.join(", ") || "None"}</p>
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-3">Row</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Admission Date</th>
                  <th className="px-3 py-3">Academic Year</th>
                  <th className="px-3 py-3">Class</th>
                  <th className="px-3 py-3">Section</th>
                  <th className="px-3 py-3">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {previewRows.map((row) => (
                  <tr key={row.row_number}>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-900">{row.row_number}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${statusClass(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="min-w-44 px-3 py-3 text-slate-700">{row.student_name || "Not provided"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{row.admission_date || "Not provided"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{row.academic_year || "Not provided"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{row.class_admitted || "Not provided"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{row.section || "Not provided"}</td>
                    <td className="min-w-72 px-3 py-3 text-slate-600">
                      {row.errors.length ? (
                        <ul className="space-y-1">
                          {row.errors.map((error) => (
                            <li key={`${row.row_number}-${error.column}-${error.message}`}>
                              <span className="font-semibold text-slate-800">{error.column}:</span> {error.message}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "Ready to import"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {validation.rows.length > previewRows.length ? (
            <p className="mt-3 text-xs text-slate-500">Showing first {previewRows.length} rows in the preview.</p>
          ) : null}

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5">
            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                disabled={validation.valid_rows === 0 || isImporting}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700"
              />
              <span>
                I reviewed the validation results and understand that {invalidCount > 0 ? "only valid rows will be imported; invalid and duplicate rows will be rejected." : "the valid rows will be imported."}
              </span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button icon={CheckCircle2} onClick={handleImport} disabled={!canImport}>
                {isImporting ? "Importing..." : "Import Valid Students"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {importResult ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <div>
              <p className="text-base font-semibold">Bulk import complete</p>
              <p className="mt-2">
                Processed {importResult.summary.rows_processed} rows. Imported {importResult.summary.imported}. Invalid {importResult.summary.invalid_rows}. Duplicate {importResult.summary.duplicate_rows}. Failed {importResult.summary.failed_rows}.
              </p>
              <p className="mt-2">
                Academic years created: {importResult.summary.academic_years_created.join(", ") || "None"}.
                Classes created: {importResult.summary.classes_created.join(", ") || "None"}.
                Sections created: {importResult.summary.sections_created.join(", ") || "None"}.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
